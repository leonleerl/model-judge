import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  ShieldCheck,
  User,
  Bot,
} from "lucide-react";
import Link from "next/link";

export default function BountyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Mock data - in a real app this would come from the ID
  const bounty = {
    id: params.id,
    title: "Summarize Web3 Trends Article",
    description:
      "Generate a concise 100-word summary of the provided article on 2024 Web3 trends. The summary must capture key points about DeFi and DAOs. The tone should be professional and suitable for a newsletter.",
    reward: "50 USDC",
    status: "Reviewing", // Open, Reviewing, Completed
    issuer: "0x123...abc",
    deadline: "2023-12-31",
    aiPrompt:
      "Evaluate the summary based on: 1. Length (approx 100 words). 2. Key topics (DeFi, DAO). 3. Tone (Professional). Output a JSON with 'score' (0-100) and 'reasoning'.",
    submission: {
      author: "0x789...xyz",
      content:
        "The 2024 Web3 landscape is defined by the maturation of DeFi protocols and the evolution of DAOs into more efficient governance structures. Key trends include the rise of Layer 2 solutions reducing transaction costs and the integration of real-world assets (RWA) into blockchain ecosystems. This summary captures the pivotal shift towards utility-driven projects.",
      timestamp: "2023-11-20 14:30",
    },
    aiVerdict: {
      score: 95,
      passed: true,
      reasoning:
        "The summary is concise and falls within the word count limit. It accurately mentions DeFi and DAOs as requested. The tone is professional. Excellent work.",
      timestamp: "2023-11-20 14:35",
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bounties
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Bounty Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">Reviewing</Badge>
                    <span className="text-sm text-muted-foreground flex items-center">
                      <Clock className="w-3 h-3 mr-1" /> Posted 2 days ago
                    </span>
                  </div>
                  <CardTitle className="text-3xl">{bounty.title}</CardTitle>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-2xl font-bold text-primary flex items-center">
                    <DollarSign className="h-6 w-6" />
                    {bounty.reward}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-2" /> Description
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {bounty.description}
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2 flex items-center text-indigo-600 dark:text-indigo-400">
                  <Bot className="w-4 h-4 mr-2" /> AI Evaluation Criteria
                </h3>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm text-muted-foreground">
                  {bounty.aiPrompt}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  *Submissions will be automatically graded by the AI model based on
                  this prompt.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submission & Verdict Section */}
          <Card className="border-indigo-100 dark:border-indigo-900 overflow-hidden">
            <div className="bg-indigo-50 dark:bg-indigo-950/30 p-4 border-b border-indigo-100 dark:border-indigo-900 flex justify-between items-center">
              <h3 className="font-semibold flex items-center">
                <ShieldCheck className="w-4 h-4 mr-2 text-indigo-600" />
                Latest Submission & Verdict
              </h3>
              <Badge variant="outline" className="bg-background">
                Auto-Verified
              </Badge>
            </div>
            <CardContent className="p-6 space-y-6">
              {/* The Submission */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium flex items-center">
                    <User className="w-3 h-3 mr-1" /> Submitter ({bounty.submission.author})
                  </span>
                  <span className="text-muted-foreground">
                    {bounty.submission.timestamp}
                  </span>
                </div>
                <div className="p-4 rounded-md border bg-background">
                  <p className="text-sm">{bounty.submission.content}</p>
                </div>
              </div>

              {/* The Arrow */}
              <div className="flex justify-center">
                <div className="h-8 w-0.5 bg-border relative">
                  <div className="absolute -bottom-1 -left-[3px] w-2 h-2 border-b border-r border-border rotate-45"></div>
                </div>
              </div>

              {/* The AI Verdict */}
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold flex items-center text-green-700 dark:text-green-400">
                    <Bot className="w-4 h-4 mr-2" /> AI Judge Verdict
                  </span>
                  <Badge className="bg-green-600 hover:bg-green-700">
                    Score: {bounty.aiVerdict.score}/100
                  </Badge>
                </div>
                <p className="text-sm text-green-800 dark:text-green-300">
                  "{bounty.aiVerdict.reasoning}"
                </p>
                <div className="mt-3 flex items-center text-xs text-green-700 dark:text-green-500">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Payout authorized automatically by Smart Contract
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bounty Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Issuer</span>
                <span className="font-mono">{bounty.issuer}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Deadline</span>
                <span>{bounty.deadline}</span>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Total Staked</span>
                  <span className="font-medium">{bounty.reward}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Platform Fee</span>
                  <span className="font-medium">2 USDC</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled={true}>
                Submission Under Review
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Submit Your Work</CardTitle>
              <CardDescription>
                Paste your text or link below. The AI will evaluate it immediately.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Label className="sr-only">Submission Content</Label>
              <Textarea
                placeholder="Enter your submission here..."
                className="min-h-[100px]"
              />
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">
                Submit Solution
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}




