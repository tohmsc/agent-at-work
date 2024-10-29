"use client";

import { useEffect } from "react";
import { Card } from "@/components/ui/card";

interface TelegramCommentsProps {
  pageId: string;
}

export function TelegramComments({ pageId }: TelegramCommentsProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-discussion", "agentatwork");
    script.setAttribute("data-comments-limit", "5");
    script.setAttribute("data-colorful", "1");
    script.setAttribute("data-dark", "1");
    script.setAttribute("data-page-id", pageId);
    
    const container = document.getElementById("telegram-comments");
    if (container) {
      container.appendChild(script);
    }

    return () => {
      if (container && script) {
        container.removeChild(script);
      }
    };
  }, [pageId]);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Comments</h2>
      <div id="telegram-comments" className="w-full" />
    </Card>
  );
} 