import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Agent, agentSchema } from "../types";
import { AgentPageClient } from "./client";
import { generateAgentSlug } from "@/utils/slug";

type Props = {
  params: Promise<{
    id: string;
    slug: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const agent = await getAgentById(resolvedParams.id);
  
  if (!agent) {
    notFound();
  }

  return {
    title: `${agent.company} - AI Agent Directory`,
    description: agent.short_description,
  };
}

export default async function AgentPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const agent = await getAgentById(resolvedParams.id);
  
  if (!agent) {
    notFound();
  }

  const expectedSlug = await generateAgentSlug(agent.company, agent.short_description);
  if (resolvedParams.slug !== expectedSlug) {
    notFound();
  }

  return <AgentPageClient agent={agent} />;
} 