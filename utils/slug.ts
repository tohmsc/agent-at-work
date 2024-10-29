export function generateAgentSlug(company: string, description: string): string {
  const baseSlug = `${company}-${description}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  
  return baseSlug.slice(0, 100); // Limit slug length
} 