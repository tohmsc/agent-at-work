"use client";

import { useState, useEffect } from "react";
import { Agent } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { categoryConfig } from "@/components/agent-card";
import { Globe, Twitter, Linkedin, Youtube, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { fetchLogoFromLogoApi, extractDomainFromUrl } from "@/utils/logo";
import { TelegramComments } from "@/components/telegram-comments";

interface AgentPageClientProps {
  agent: Agent;
}

function getYouTubeId(url: string): string {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match?.[1] || '';
}

export function AgentPageClient({ agent }: AgentPageClientProps) {
  const CategoryIcon = categoryConfig[agent.category].icon;
  const images = [agent.photo1, agent.photo2, agent.photo3].filter(Boolean) as string[];
  const [activeImage, setActiveImage] = useState(0);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLogo() {
      if (agent.website_url) {
        const logo = await fetchLogoFromLogoApi(agent.website_url);
        if (logo) setLogoUrl(logo);
      }
    }
    fetchLogo();
  }, [agent.website_url]);

  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-[5%]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 py-12">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shrink-0">
                {logoUrl || agent.logo ? (
                  <Image
                    src={(logoUrl || agent.logo) as string}
                    alt={agent.company}
                    width={128}
                    height={128}
                    className="w-full h-full object-contain"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-medium text-muted-foreground bg-muted">
                    {agent.company.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight">{agent.company}</h1>
                <p className="text-xl text-muted-foreground mt-2">{agent.short_description}</p>
              </div>
            </div>

            {/* Description */}
            {agent.long_description && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">About</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {agent.long_description}
                </p>
              </Card>
            )}

            {/* Media Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* YouTube Video */}
              {agent.youtube_url && (
                <Card className="overflow-hidden">
                  <div className="aspect-[9/16] relative">
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeId(agent.youtube_url)}`}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </Card>
              )}

              {/* Image Gallery */}
              {images.length > 0 && (
                <Card className="overflow-hidden">
                  <div className="relative aspect-[9/16]">
                    <Image
                      src={images[activeImage]}
                      alt={`${agent.company} Photo ${activeImage + 1}`}
                      fill
                      className="object-cover"
                    />
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full p-2 transition-colors"
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full p-2 transition-colors"
                        >
                          <ChevronRight className="h-6 w-6" />
                        </button>
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                          {images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setActiveImage(index)}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                index === activeImage ? 'bg-white' : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              )}
            </div>
            <div className="mt-8">
              <TelegramComments pageId={`agent-${agent.id}`} />
            </div>
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-6">
              {/* Category */}
              <Card className="p-6">
                <Badge 
                  className={cn(
                    "h-8 px-3 text-sm w-full justify-center",
                    categoryConfig[agent.category].color,
                    categoryConfig[agent.category].bgColor
                  )}
                >
                  <CategoryIcon className="mr-2 h-4 w-4" />
                  {agent.category.replace('_', ' ')}
                </Badge>
                <div className="mt-3 text-sm text-center text-muted-foreground">
                  {agent.is_free ? 'Free to Use' : 'Paid Service'}
                </div>
              </Card>

              {/* Links */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Links</h3>
                <div className="flex flex-col gap-3">
                  {agent.website_url && (
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href={agent.website_url} target="_blank" rel="noopener noreferrer">
                        <Globe className="mr-2 h-4 w-4" />
                        Website
                        <ArrowUpRight className="ml-auto h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  
                  {agent.twitter_url && (
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href={agent.twitter_url} target="_blank" rel="noopener noreferrer">
                        <Twitter className="mr-2 h-4 w-4" />
                        Twitter
                        <ArrowUpRight className="ml-auto h-4 w-4" />
                      </Link>
                    </Button>
                  )}

                  {agent.linkedin_url && (
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href={agent.linkedin_url} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="mr-2 h-4 w-4" />
                        LinkedIn
                        <ArrowUpRight className="ml-auto h-4 w-4" />
                      </Link>
                    </Button>
                  )}

                  {agent.youtube_url && (
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href={agent.youtube_url} target="_blank" rel="noopener noreferrer">
                        <Youtube className="mr-2 h-4 w-4" />
                        YouTube
                        <ArrowUpRight className="ml-auto h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 