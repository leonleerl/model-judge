import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateBountyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bounties
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Bounty</CardTitle>
          <CardDescription>
            Define the task and set the reward. The AI model will use your
            verification criteria to judge submissions.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor="title">Bounty Title</Label>
            <Input
              id="title"
              placeholder="e.g. Write a summary of the latest Ethereum upgrade"
            />
            <p className="text-xs text-muted-foreground">
              A clear and concise title for your task.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description</Label>
            <Textarea
              id="description"
              placeholder="Describe exactly what needs to be done..."
              className="min-h-[120px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="reward">Reward Amount (USDC)</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground">
                  $
                </span>
                <Input id="reward" type="number" className="pl-7" placeholder="50" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline (Days)</Label>
              <Input id="deadline" type="number" placeholder="7" />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="criteria">AI Verification Criteria (Prompt)</Label>
            <Textarea
              id="criteria"
              placeholder="Enter the instructions for the AI model. e.g. 'Check if the summary is under 100 words and mentions 'Dencun upgrade'. Score 0-100.'"
              className="min-h-[120px] font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              This prompt will be sent to the LLM to evaluate the submission.
              Be specific about pass/fail conditions.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="outline">Cancel</Button>
          <Button>Create Bounty & Stake Funds</Button>
        </CardFooter>
      </Card>
    </div>
  );
}




