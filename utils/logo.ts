import { createClient } from "@/utils/supabase/client";

export async function fetchLogoFromLogoApi(url: string) {
  try {
    const domain = extractDomainFromUrl(url);
    if (!domain) return null;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch (error) {
    console.error('Error fetching logo:', error);
    return null;
  }
}

export function extractDomainFromUrl(url: string): string | null {
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    return domain;
  } catch {
    return null;
  }
}

// Alias for backward compatibility
export const generateLogo = fetchLogoFromLogoApi;