"use client";

import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { motion } from "framer-motion";
import { generateLogo } from "@/utils/logo";
import { IconType } from "react-icons";
import { BsMegaphone, BsCashCoin, BsPalette, BsShare, BsGear, BsHeadset, BsBox, BsCode, BsCoin, BsThreeDots } from "react-icons/bs";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { use } from "react";
import { ArrowRight } from "lucide-react";
import { getStorageUrl } from '@/utils/supabase/storage-url';
import { ImageLoading } from "./ui/image-loading";
import Image from "next/image";

function generateAgentSlug(company: string, description: string): string {
  return `${company.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${description.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`.replace(/^-|-$/g, '');
}

export const categoryConfig = {
  MARKETING: { icon: BsMegaphone, color: "text-blue-400", bgColor: "bg-blue-50/50" },
  SALES: { icon: BsCashCoin, color: "text-emerald-400", bgColor: "bg-emerald-50/50" },
  DESIGN: { icon: BsPalette, color: "text-violet-400", bgColor: "bg-violet-50/50" },
  SOCIAL_MEDIA: { icon: BsShare, color: "text-pink-400", bgColor: "bg-pink-50/50" },
  OPERATIONS: { icon: BsGear, color: "text-slate-400", bgColor: "bg-slate-50/50" },
  CUSTOMER_SERVICE: { icon: BsHeadset, color: "text-amber-400", bgColor: "bg-amber-50/50" },
  PRODUCT: { icon: BsBox, color: "text-orange-400", bgColor: "bg-orange-50/50" },
  ENGINEERING: { icon: BsCode, color: "text-rose-400", bgColor: "bg-rose-50/50" },
  CRYPTO: { icon: BsCoin, color: "text-indigo-400", bgColor: "bg-indigo-50/50" },
  OTHER: { icon: BsThreeDots, color: "text-gray-400", bgColor: "bg-gray-50/50" }
};

interface AgentCardProps {
  id: string;
  company: string;
  shortDescription: string;
  category: keyof typeof categoryConfig;
  isFree: boolean;
  logo?: string;
  header_image?: string;
  website_url?: string;
}

export function AgentCard({ id, company, shortDescription, category, isFree, logo, header_image, website_url }: AgentCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const getFaviconUrl = (websiteUrl: string | null) => {
    if (!websiteUrl) return null;
    try {
      const url = new URL(websiteUrl);
      return `https://www.google.com/s2/favicons?sz=32&domain=${url.hostname}`;
    } catch {
      return null;
    }
  };

  const displayImage = header_image 
    ? getStorageUrl(header_image)
    : null;
    
  const logoUrl = logo 
    ? getStorageUrl(logo)
    : getFaviconUrl(website_url || null);

  const CategoryIcon = categoryConfig[category.toUpperCase() as keyof typeof categoryConfig].icon;
  const slug = generateAgentSlug(company, shortDescription);

  return (
    <Link href={`/agents/${id}/${slug}`}>
      <Card className="overflow-hidden h-full transition-colors hover:bg-muted/50 flex flex-col">
        {/* Header with Company Name and Category */}
        <div className="p-4 border-b border-border/50 bg-background flex items-center justify-between">
          <div className="flex items-center gap-2">
            {logoUrl && !imageError && (
              <div className="relative w-6 h-6">
                <Image
                  src={logoUrl}
                  alt={`${company} Logo`}
                  fill
                  className="object-contain"
                  onError={() => setImageError(true)}
                />
              </div>
            )}
            <h3 className="font-medium text-xl tracking-tight">{company}</h3>
          </div>
          <Badge 
            className={cn(
              "text-sm px-3 py-1 font-medium hover:scale-105 transition-transform border-0", 
              categoryConfig[category.toUpperCase() as keyof typeof categoryConfig].color,
              categoryConfig[category.toUpperCase() as keyof typeof categoryConfig].bgColor
            )}
          >
            <CategoryIcon className="h-4 w-4 mr-2" />
            {category.replace('_', ' ')}
          </Badge>
        </div>

        {/* Header Image */}
        <div className="relative aspect-video bg-muted">
          {displayImage && !imageError ? (
            <Image
              src={displayImage}
              alt={`${company} Header`}
              fill
              className="object-cover"
              onLoadingComplete={() => setIsLoading(false)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No preview available
            </div>
          )}
          {isLoading && displayImage && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <ImageLoading />
            </div>
          )}
        </div>

        {/* Description */}
        <div className="p-4 flex-grow">
          <p className="text-muted-foreground line-clamp-2">{shortDescription}</p>
        </div>

        {/* View Profile Bar */}
        <div className="mt-auto border-t border-border/50 p-3 bg-background">
          <div className="flex items-center justify-between text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            <span>View Profile</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
