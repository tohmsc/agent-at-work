"use client";

import { Dog, Twitter, Github, MessageCircle, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { subscribeAction } from "@/app/actions/subscribe";
import { SubmitButton } from "@/components/submit-button";
import { FormMessage } from "./form-message";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Message = {
  message: string;
  type: 'success' | 'error';
};

const isValidMessageType = (type: string | null): type is Message['type'] => 
  type === 'success' || type === 'error';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  const type = searchParams.get('type');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    const result = await subscribeAction(formData);
    if ('success' in result) {
      setIsSuccess(true);
      toast.success(result.success);
      setTimeout(() => setIsSuccess(false), 3000);
    } else if ('error' in result) {
      toast.error(result.error);
    }
  };

  return (
    <footer className="w-full bg-black text-white">
      {/* Main Content */}
      <div className="container mx-auto px-[5%] py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-6 space-y-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="rounded-xl bg-white/10 p-3">
                <Dog className="h-6 w-6" />
              </div>
              <span className="text-xl font-semibold">Agent at Work</span>
            </Link>
            <p className="text-gray-400 text-lg leading-relaxed">
              Discover and integrate the best AI agents to automate your workflow. Hand-picked and updated weekl.
            </p>
            <div className="flex gap-4">
              {/* <Link
                href="https://twitter.com/agentatwork_ai"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://github.com/agent-at-work"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Github className="h-5 w-5" />
              </Link> */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="https://t.me/+GckjoiAXodoyOTM8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <MessageCircle className="h-5 w-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Join our Telegram Group</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-6 space-y-8">
            <h3 className="text-lg font-semibold">Subscribe to our newsletter</h3>
            <p className="text-gray-400">
              Get the latest AI agents and automation tips delivered to your inbox.
            </p>
            <div className="space-y-4">
              <form action={handleSubmit} className="space-y-4">
                <Input 
                  name="email"
                  type="email" 
                  placeholder="Enter your email" 
                  className={`h-12 bg-white/10 border-white/10 text-white placeholder:text-gray-500 transition-colors
                    ${isSuccess ? 'border-green-500 bg-green-500/10' : ''}`}
                  required
                />
                <SubmitButton 
                  pendingText="Subscribing..." 
                  className={`w-full h-12 transition-colors
                    ${isSuccess 
                      ? 'bg-green-500 hover:bg-green-600 text-white' 
                      : 'bg-white text-black hover:bg-white/90'
                    }`}
                >
                  {isSuccess ? 'Subscribed!' : 'Subscribe'}
                </SubmitButton>
                {message && type && (
                  <FormMessage 
                    message={
                      type === 'success' 
                        ? { success: message }
                        : { error: message }
                    } 
                  />
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-6 py-6">
          <p className="text-gray-400 text-center">
            © {currentYear} Agent at Work. All rights reserved.
          </p>
        </div>
      </div>

      {/* Telegram Community */}
      <Button variant="outline" className="w-full justify-start" asChild>
        <Link href="https://t.me/+GckjoiAXodoyOTM8" target="_blank" rel="noopener noreferrer">
          <MessageCircle className="mr-2 h-4 w-4" />
          Join Community
          <ArrowUpRight className="ml-auto h-4 w-4" />
        </Link>
      </Button>
    </footer>
  );
}
