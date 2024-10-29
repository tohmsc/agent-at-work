"use client";

import { Badge } from "@/components/ui/badge";
import { categoryConfig } from "@/components/agent-card";

interface AgentHeaderProps {
  title: string;
  description: string;
  category: "Sales" | "Marketing" | "Design" | "Social_Media" | "Operations" | "Customer_Service" | "Product" | "Engineering" | "Crypto" | "Other";
}

export function AgentHeader({ title, description, category }: AgentHeaderProps) {
  const uppercaseCategory = category.toUpperCase() as keyof typeof categoryConfig;
  const CategoryIcon = categoryConfig[uppercaseCategory].icon;
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted">
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            {title.charAt(0)}
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
          <p className="text-xl text-muted-foreground mt-2">{description}</p>
        </div>
      </div>

      <Badge 
        className={`w-fit ${categoryConfig[uppercaseCategory].color}`}
      >
        <CategoryIcon className="h-4 w-4 mr-2" />
        {category.replace('_', ' ')}
      </Badge>
    </div>
  );
} 