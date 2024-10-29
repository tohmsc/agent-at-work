"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { CursorAnimation } from "./cursor-animation";
import { subscribeAction } from "@/app/actions/subscribe";
import { FormMessage } from "./form-message";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";
import { LogoStack } from "./logo-stack";

export function HeroSection() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<'success' | 'error' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if URL has #subscribe-form hash
    if (window.location.hash === '#subscribe-form') {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, []);

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
    <section className="relative py-20">
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
          className="text-[20px] leading-[1.4] font-normal tracking-normal text-[#747474] mb-12 max-w-2xl mx-auto"
        >
          Featuring over 100+ AI Agents — for every business function.
          <br />
          New handpicked content weekly.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center gap-4 justify-center max-w-md mx-auto"
        >
          <form id="subscribe-form" action={handleSubmit} className="flex flex-col sm:flex-row gap-4 w-full">
            <Input 
              ref={inputRef}
              name="email"
              type="email" 
              placeholder="Enter your email" 
              className={`h-12 rounded-full text-sm transition-colors pl-6
                ${isSuccess ? 'border-green-500 bg-green-500/10' : ''}`}
              required
            />
            <Button 
              className={`h-12 px-6 text-sm rounded-full transition-colors w-full sm:w-auto group
                ${isSuccess 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-foreground text-background hover:bg-foreground/90'}`}
            >
              {isSuccess ? 'Subscribed!' : 'Subscribe for free'}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </form>
          {message && type && (
            <FormMessage 
              message={
                type === 'success' 
                  ? { success: message }
                  : { error: message }
              }
            />
          )}
        </motion.div>
      </div>
    </section>
  );
}
