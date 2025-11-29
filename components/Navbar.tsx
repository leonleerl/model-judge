import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Gavel } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Gavel className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">ModelJudge</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/create">
            <Button variant="ghost">Create Bounty</Button>
          </Link>
          <Button variant="outline">Connect Wallet</Button>
        </div>
      </div>
    </nav>
  );
}

