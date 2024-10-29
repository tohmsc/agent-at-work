"use client";

import { useRef, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { subscribeAction } from "@/app/_actions/subscribe";
import { LogoStack } from "./logo-stack";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type SubscribeResult = {
  success?: string;
  error?: string;
};

function HeroContent() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<'success' | 'error' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (window.location.hash === '#subscribe-form') {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, []);

  const handleSubmit = async (formData: FormData) => {
    const result: SubscribeResult = await subscribeAction(formData);
    if ('success' in result) {
      setIsSuccess(true);
      toast.success(result.success);
      setTimeout(() => setIsSuccess(false), 3000);
    } else if ('error' in result) {
      toast.error(result.error);
    }
  };

  return (
    <div className="container px-4 mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <LogoStack />
      </motion.div>
      <motion.h1 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-6xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1] relative z-0"
      >
        Discover the 
        <br /> 
        best AI Agents.
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl text-muted-foreground mb-8"
      >
        Featuring over 100+ AI Agents to automate your work. 
        <br />
        Updated weekly.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-md mx-auto"
        id="subscribe-form"
      >
        <form action={handleSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            name="email"
            type="email"
            placeholder="Enter your email"
            className={`h-12 ${isSuccess ? 'border-green-500' : ''}`}
            required
          />
          <Button 
            type="submit"
            className={`px-8 h-12 ${
              isSuccess 
                ? 'bg-green-500 hover:bg-green-600' 
                : ''
            }`}
          >
            {isSuccess ? 'Subscribed!' : 'Subscribe'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative py-20">
      <Suspense fallback={
        <div className="container px-4 mx-auto text-center animate-pulse">
          <div className="h-20 bg-muted rounded mb-8" />
          <div className="h-32 bg-muted rounded" />
        </div>
      }>
        <HeroContent />
      </Suspense>
    </section>
  );
}
