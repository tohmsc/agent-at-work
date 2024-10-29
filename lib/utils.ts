import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateAgentSlug(company: string, description: string): string {
  return `${company.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${description
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 50)}`.replace(/-+/g, '-').replace(/^-|-$/g, '');
}
