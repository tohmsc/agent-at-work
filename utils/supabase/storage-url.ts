import { createClient } from "./client";

export function getStorageUrl(path: string | null) {
  if (!path) return null;
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return null;

  // Remove any leading/trailing whitespace and slashes
  const cleanPath = path
    .trim()
    .replace(/^\/+/, '')
    .replace(/\/+$/, '')
    .replace(/\/+/g, '/');

  return `${supabaseUrl}/storage/v1/object/public/${cleanPath}`;
} 