// Chainlink Functions Source Code
// 该脚本在 Chainlink DON (去中心化预言机网络) 节点中运行

// 获取输入参数 (与 Solidity 合约中 args 数组对应)
const criteriaPrompt = args[0];
const submissionText = args[1];

if (!criteriaPrompt || !submissionText) {
  throw Error("Missing arguments: criteriaPrompt or submissionText");
}

// 构造发给 LLM 的完整提示词
// 我们强制要求 LLM 返回特定的 JSON 格式，以便解析
const systemPrompt = `You are an AI Judge for a bounty platform. 
Your job is to evaluate a user submission based on specific criteria.
You must return a strict JSON object with no markdown formatting.
Format: { "score": <integer_0_to_100>, "reasoning": "<string_explanation>" }`;

const userMessage = `
CRITERIA (The Rule): 
${criteriaPrompt}

USER SUBMISSION:
${submissionText}

Evaluate the submission against the criteria. Give a score from 0 to 100.
`;

// 构造 OpenAI 请求对象
// 注意：secrets.openaiKey 是在部署或订阅管理时加密上传的，不会暴露在代码中
const openAIRequest = Functions.makeHttpRequest({
  url: "https://api.openai.com/v1/chat/completions",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${secrets.openaiKey}`,
  },
  data: {
    model: "gpt-4o-mini", // 或 "gpt-3.5-turbo", 选择性价比高的模型
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    temperature: 0.2, // 低温度以获得更客观、稳定的结果
  },
});

// 发起请求并等待响应
const openAIResponse = await openAIRequest;

if (openAIResponse.error) {
  throw Error(`OpenAI Error: ${JSON.stringify(openAIResponse)}`);
}

// 解析结果
const resultData = openAIResponse.data;
const aiContent = resultData.choices[0].message.content;

// 尝试从返回内容中提取 JSON
// 有时候 LLM 会包含 Markdown 标记 (```json ... ```)，需要清洗
let parsedResult;
try {
  const cleanContent = aiContent
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
  parsedResult = JSON.parse(cleanContent);
} catch (e) {
  throw Error(`Failed to parse AI response: ${aiContent}`);
}

const score = Math.round(parsedResult.score);

console.log(`AI Verdict: Score ${score}. Reasoning: ${parsedResult.reasoning}`);

// 安全检查：确保分数在 0-100 之间
if (score < 0 || score > 100) {
  throw Error(`Invalid score range: ${score}`);
}

// 将结果编码为 uint256 返回给智能合约
return Functions.encodeUint256(score);
