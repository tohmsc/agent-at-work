import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Agent, agentSchema } from "../types";
import { AgentPageClient } from "./client";
import { generateAgentSlug } from "@/utils/slug";

interface PageProps {
  params: {
    id: string;
    slug: string;
  };
}

async function getAgentById(id: string): Promise<Agent | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('submissions')
    .select('*')
    .eq('id', id)
    .single();

  if (!data) return null;

  const parsedAgent = agentSchema.safeParse(data);
  if (!parsedAgent.success) {
    console.error("Invalid agent data:", parsedAgent.error);
    return null;
  }

  return parsedAgent.data;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const agent = await getAgentById(params.id);
  
  if (!agent) {
    notFound();
  }

  return {
    title: `${agent.company} - AI Agent Directory`,
    description: agent.short_description,
  };
}

export default async function AgentPage({ params }: PageProps) {
  const agent = await getAgentById(params.id);
  
  if (!agent) {
    notFound();
  }

  const expectedSlug = await generateAgentSlug(agent.company, agent.short_description);
  if (params.slug !== expectedSlug) {
    notFound();
  }

  return <AgentPageClient agent={agent} />;
} 