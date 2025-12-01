// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IERC20} from "../lib/forge-std/src/interfaces/IERC20.sol";
import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";

/**
 * @title ModelJudge
 * @notice 去中心化 AI 裁决平台合约
 * @dev 利用 Chainlink Functions 连接链下 LLM 进行结果验证
 */
contract ModelJudge is FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;

    // --- 状态定义 ---

    enum BountyStatus {
        Open, // 开放中，等待提交
        Reviewing, // 已提交，AI 正在评审
        Completed, // 评审通过，奖金已发放
        Failed, // 评审未通过，等待重新提交或退款
        Cancelled // 悬赏已取消
    }

    struct Bounty {
        uint256 id;
        address issuer; // 悬赏发布者
        address token; // 支付代币地址 (如 USDC)
        uint256 amount; // 奖励金额
        string description; // 任务描述 (或 IPFS Hash)
        string aiPrompt; // 给 AI 的评审提示词
        address submitter; // 当前提交者
        string submissionText; // 提交内容 (或 IPFS Hash)
        uint256 aiScore; // AI 打分 (0-100)
        BountyStatus status;
    }

    // --- 存储变量 ---

    uint256 public s_bountyCounter;
    mapping(uint256 => Bounty) public s_bounties;

    // 映射 Chainlink 请求 ID => 悬赏 ID
    mapping(bytes32 => uint256) public s_requestToBountyId;

    // Chainlink Functions 配置
    address public router;
    bytes32 public donId; // Decentralized Oracle Network ID
    uint64 public subscriptionId; // Chainlink Subscription ID
    uint32 public gasLimit = 300000;
    string public source; // 链下运行的 JavaScript 源代码

    // --- 事件 ---

    event BountyCreated(
        uint256 indexed bountyId,
        address indexed issuer,
        uint256 amount
    );
    event WorkSubmitted(uint256 indexed bountyId, address indexed submitter);
    event ReviewRequested(uint256 indexed bountyId, bytes32 indexed requestId);
    event ReviewCompleted(uint256 indexed bountyId, uint256 score, bool passed);
    event BountyPaid(
        uint256 indexed bountyId,
        address indexed winner,
        uint256 amount
    );

    // --- 错误定义 ---

    error InvalidAmount();
    error BountyNotOpen();
    error NotIssuer();
    error TransferFailed();

    // --- 构造函数 ---

    constructor(
        address _router,
        bytes32 _donId,
        uint64 _subId
    ) FunctionsClient(_router) ConfirmedOwner(msg.sender) {
        router = _router;
        donId = _donId;
        subscriptionId = _subId;
    }

    // --- 核心逻辑 ---

    /**
     * @notice 1. 创建悬赏
     * @param _token 支付代币地址
     * @param _amount 奖励数量
     * @param _desc 任务描述
     * @param _prompt AI 判定标准
     */
    function createBounty(
        address _token,
        uint256 _amount,
        string calldata _desc,
        string calldata _prompt
    ) external returns (uint256) {
        if (_amount == 0) revert InvalidAmount();

        // 转移代币到合约 (用户需先 Approve)
        bool success = IERC20(_token).transferFrom(
            msg.sender,
            address(this),
            _amount
        );
        if (!success) revert TransferFailed();

        uint256 bountyId = s_bountyCounter++;

        s_bounties[bountyId] = Bounty({
            id: bountyId,
            issuer: msg.sender,
            token: _token,
            amount: _amount,
            description: _desc,
            aiPrompt: _prompt,
            submitter: address(0),
            submissionText: "",
            aiScore: 0,
            status: BountyStatus.Open
        });

        emit BountyCreated(bountyId, msg.sender, _amount);
        return bountyId;
    }

    /**
     * @notice 2. 提交任务结果
     */
    function submitWork(
        uint256 _bountyId,
        string calldata _submissionText
    ) external {
        Bounty storage bounty = s_bounties[_bountyId];
        if (
            bounty.status != BountyStatus.Open &&
            bounty.status != BountyStatus.Failed
        ) {
            revert BountyNotOpen();
        }

        bounty.submitter = msg.sender;
        bounty.submissionText = _submissionText;
        bounty.status = BountyStatus.Reviewing;

        emit WorkSubmitted(_bountyId, msg.sender);
    }

    /**
     * @notice 3. 触发 AI 评审 (调用 Chainlink Functions)
     * @dev 任何人都可以调用，通常由提交者或前端自动调用
     */
    function triggerAIReview(uint256 _bountyId) external returns (bytes32) {
        Bounty storage bounty = s_bounties[_bountyId];
        require(
            bounty.status == BountyStatus.Reviewing,
            "Not ready for review"
        );

        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source); // 使用设置好的 JS 源码

        string[] memory args = new string[](2);
        args[0] = bounty.aiPrompt; // 参数 1: AI 提示词
        args[1] = bounty.submissionText; // 参数 2: 用户提交的内容
        req.setArgs(args);

        // 发送请求到 Chainlink DON
        bytes32 requestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donId
        );

        s_requestToBountyId[requestId] = _bountyId;
        emit ReviewRequested(_bountyId, requestId);

        return requestId;
    }

    /**
     * @notice 4. Chainlink 回调 (AI 结果返回)
     * @dev 只有 Router 能调用此函数
     */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        uint256 bountyId = s_requestToBountyId[requestId];
        Bounty storage bounty = s_bounties[bountyId];

        if (err.length > 0) {
            // 处理错误：重置为 Open 或 Failed
            bounty.status = BountyStatus.Failed;
            return;
        }

        // 假设 JS 脚本返回的是一个 uint256 分数 (0-100)
        // 注意：实际编码方式取决于你的 JS 脚本如何 encode 结果
        uint256 score = abi.decode(response, (uint256));
        bounty.aiScore = score;

        // 判定逻辑：如果分数 >= 80 则通过
        if (score >= 80) {
            bounty.status = BountyStatus.Completed;
            // 发放奖励
            IERC20(bounty.token).transfer(bounty.submitter, bounty.amount);
            emit BountyPaid(bountyId, bounty.submitter, bounty.amount);
            emit ReviewCompleted(bountyId, score, true);
        } else {
            bounty.status = BountyStatus.Failed;
            emit ReviewCompleted(bountyId, score, false);
        }
    }

    // --- 管理功能 ---

    /**
     * @notice 设置用于评估的 JavaScript 源码
     */
    function setSourceCode(string calldata _source) external onlyOwner {
        source = _source;
    }

    /**
     * @notice 紧急取款/取消悬赏
     */
    function cancelBounty(uint256 _bountyId) external {
        Bounty storage bounty = s_bounties[_bountyId];
        if (msg.sender != bounty.issuer) revert NotIssuer();
        if (bounty.status == BountyStatus.Completed)
            revert("Already completed");

        bounty.status = BountyStatus.Cancelled;
        IERC20(bounty.token).transfer(bounty.issuer, bounty.amount);
    }
}
