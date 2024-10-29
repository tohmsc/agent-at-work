import { redirect, notFound } from 'next/navigation';
import { createClient } from "@/utils/supabase/server";
import { Agent, agentSchema } from "./types";

async function getAgent(id: string | number): Promise<Agent> {
  const supabase = await createClient();
  const { data: agent } = await supabase
    .from('submissions')
    .select('*')
    .eq('id', id)
    .single();
  
  if (!agent) {
    notFound();
  }
  
  const parsedAgent = agentSchema.safeParse(agent);
  if (!parsedAgent.success) {
    console.error("Invalid agent data:", parsedAgent.error);
    notFound();
  }
  
  return parsedAgent.data;
}

async function generateAgentSlug(company: string, description: string): Promise<string> {
  return `${company.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${description
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 50)}`;
}

type PageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AgentPageRedirect({ params }: PageProps) {
  const resolvedParams = await params;
  const agent = await getAgent(resolvedParams.id);
  const slug = await generateAgentSlug(agent.company, agent.short_description);
  redirect(`/agents/${resolvedParams.id}/${slug}`);
}
