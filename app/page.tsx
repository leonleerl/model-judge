import Link from "next/link";
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
import { Clock, DollarSign, BrainCircuit, ArrowRight } from "lucide-react";

// Mock data for bounties
const bounties = [
  {
    id: 1,
    title: "Summarize Web3 Trends Article",
    description:
      "Generate a concise 100-word summary of the provided article on 2024 Web3 trends. The summary must capture key points about DeFi and DAOs.",
    reward: "50 USDC",
    status: "Open",
    deadline: "2 days left",
  },
  {
    id: 2,
    title: "Python Script for Data Cleaning",
    description:
      "Write a Python script to clean a CSV dataset containing 10,000 rows. Remove duplicates and handle missing values according to the spec.",
    reward: "150 USDC",
    status: "Reviewing",
    deadline: "Ended",
  },
  {
    id: 3,
    title: "Translate Whitepaper to Spanish",
    description:
      "Translate the attached technical whitepaper from English to Spanish. Ensure technical terminology is accurate.",
    reward: "300 USDC",
    status: "Open",
    deadline: "5 days left",
  },
  {
    id: 4,
    title: "Generate Marketing Copy for NFT Launch",
    description:
      "Create 5 variations of tweet copy for an upcoming NFT collection launch. Tone should be exciting and engaging.",
    reward: "20 USDC",
    status: "Closed",
    deadline: "Completed",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50 border-b">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium">
                <BrainCircuit className="mr-2 h-4 w-4" />
                AI-Powered Verification
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Decentralized Task Adjudication
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto">
                Create tasks, submit work, and get paid. Results are verified by
                AI models via Chainlink & Smart Contracts. Fair, fast, and
                trustless.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/create">
                <Button size="lg">Create Bounty</Button>
              </Link>
              <Button variant="outline" size="lg">
                Learn How It Works
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Bounties List Section */}
      <section className="container px-4 md:px-6 py-12 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Active Bounties</h2>
          <Button variant="ghost" className="hidden sm:flex">
            View all <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bounties.map((bounty) => (
            <Link key={bounty.id} href={`/bounty/${bounty.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="line-clamp-1 text-lg">
                      {bounty.title}
                    </CardTitle>
                    <Badge
                      variant={
                        bounty.status === "Open"
                          ? "default"
                          : bounty.status === "Reviewing"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {bounty.status}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center mt-2">
                    <span className="font-semibold text-primary flex items-center">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {bounty.reward}
                    </span>
                    <span className="mx-2 text-muted-foreground">•</span>
                    <span className="flex items-center text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {bounty.deadline}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {bounty.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="secondary" className="w-full">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
