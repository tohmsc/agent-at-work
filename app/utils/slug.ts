export async function generateAgentSlug(company: string, shortDescription: string): Promise<string> {
  return `${company.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${shortDescription.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)}`.replace(/-+/g, '-').replace(/^-|-$/g, '');
} 