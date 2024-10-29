"use client";

import { categoryConfig } from "./agent-card";

interface AgentCategoryIconProps {
  category: keyof typeof categoryConfig;
}

export function AgentCategoryIcon({ category }: AgentCategoryIconProps) {
  const CategoryIcon = categoryConfig[category].icon;
  
  return (
    <CategoryIcon className={`h-5 w-5 ${categoryConfig[category].color}`} />
  );
}
