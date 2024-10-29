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
  website_url?: string;
}

export function AgentCard({ id, company, shortDescription, category, isFree, logo, website_url }: AgentCardProps) {
  const [generatedLogo, setGeneratedLogo] = useState<string | null>(null);
  const CategoryIcon = categoryConfig[category.toUpperCase() as keyof typeof categoryConfig]?.icon;
  
  useEffect(() => {
    async function fetchLogo() {
      if (!logo && website_url) {
        const logoUrl = await generateLogo(website_url);
        if (logoUrl) {
          setGeneratedLogo(logoUrl);
        }
      }
    }
    fetchLogo();
  }, [logo, website_url]);

  const displayLogo = logo || generatedLogo || '/placeholder-image.jpg';

  return (
    <Link href={`/agents/${id}/${generateAgentSlug(company, shortDescription)}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Card className="overflow-hidden group cursor-pointer border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
          {/* Header with Company Name and Category */}
          <div className="p-4 border-b border-border/50 bg-background flex items-center justify-between">
            <h3 className="font-bold text-xl tracking-tight">{company}</h3>
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

          {/* Main Image/Logo Section */}
          <div className="aspect-square relative bg-background/50 p-6 group/image">
            <img
              src={displayLogo}
              alt={company}
              className="object-contain w-full h-full transition-all duration-300 group-hover/image:scale-110 group-hover/image:rotate-2"
            />
          </div>

          {/* Description Section */}
          <div className="border-t border-border/50">
            <div className="p-4 group/desc hover:bg-muted/30 transition-colors">
              <p className="text-base text-muted-foreground leading-relaxed line-clamp-2 text-center">
                {shortDescription}
              </p>
            </div>
            
            {/* View Profile Bar */}
            <div className="border-t border-border/50 p-3 bg-background group/profile hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between text-sm font-medium">
                <span className="text-muted-foreground group-hover/profile:text-foreground transition-colors">
                  View Profile
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover/profile:text-foreground group-hover/profile:translate-x-1 transition-all" />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
}
