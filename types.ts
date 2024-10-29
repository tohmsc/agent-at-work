import { z } from "zod";

export const agentSchema = z.object({
  id: z.number(),
  company: z.string(),
  short_description: z.string(),
  // Add other fields based on your Supabase table schema
});

export type Agent = z.infer<typeof agentSchema>; 