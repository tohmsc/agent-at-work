"use client";

import { useRef, useEffect, useState } from "react";
import { Dog, Search, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "/" && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSubscribeClick = () => {
    router.push('/#subscribe-form');
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      const input = document.querySelector<HTMLInputElement>('#subscribe-form input[type="email"]');
      const form = document.querySelector('#subscribe-form');
      const header = document.querySelector('header');
      
      if (form && header) {
        const windowHeight = window.innerHeight;
        const formRect = form.getBoundingClientRect();
        const headerHeight = header.getBoundingClientRect().height;
        
        // Calculate offset considering header height
        const offset = formRect.top + window.scrollY - (windowHeight - formRect.height) / 2 - headerHeight;
        
        window.scrollTo({
          top: offset,
          behavior: 'smooth'
        });
        
        input?.focus();
      }
    }, 100);
  };

  return (
    <header className="w-full">
      <div className="container mx-auto px-[5%]">
        <div className="flex h-20 items-center justify-between gap-8">
          {/* Logo and Title */}
          <Link href="/" className="flex items-center gap-4 hover:opacity-90">
            <div className="rounded-lg p-2.5">
              <Dog className="h-5 w-5" />
            </div>
            <h1 className="text-lg font-semibold tracking-tight">Agent at Work</h1>
          </Link>

          {/* Search Bar */}
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

          {/* Actions */}
          <div className="flex items-center gap-6">
            <Link 
              href="/submit" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Submit
            </Link>

            <Button 
              onClick={handleSubscribeClick}
              className="group bg-foreground text-background hover:bg-foreground/90"
            >
              Subscribe
              <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
