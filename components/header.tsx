"use client";

import { useRef, useState, Suspense, useEffect } from "react";
import { Dog, Search } from "lucide-react";
import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

function SearchBar() {
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative mx-4">
      <Input
        ref={searchRef}
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search agents..."
        className="pl-10 pr-8 h-11 rounded-full bg-muted/50"
      />
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <kbd className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
        /
      </kbd>
    </form>
  );
}

export function Header() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        searchInput?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="w-full">
      <div className="container mx-auto px-[5%]">
        <div className="flex h-20 items-center justify-between gap-8">
          <Link href="/" className="flex items-center gap-4 hover:opacity-90">
            <div className="rounded-lg p-2.5">
              <Dog className="h-5 w-5" />
            </div>
            <h1 className="text-lg font-semibold tracking-tight">Agent at Work</h1>
          </Link>

          <Suspense fallback={
            <div className="hidden md:flex flex-1 max-w-xl mx-4">
              <div className="w-full h-11 bg-muted/50 rounded-full animate-pulse" />
            </div>
          }>
            <SearchBar />
          </Suspense>

          <div className="flex items-center gap-4">
            <Link href="/submit" className="text-sm text-muted-foreground hover:text-foreground">
              Submit
            </Link>
            <Button asChild size="sm">
              <Link href="#subscribe-form">Subscribe</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
