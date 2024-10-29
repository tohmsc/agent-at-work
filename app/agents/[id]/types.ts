import { z } from "zod";

export const agentSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(val => String(val)),
  company: z.string(),
  short_description: z.string(),
  long_description: z.string().nullable(),
  category: z.string().transform(val => val.toUpperCase()).pipe(
    z.enum([
      "MARKETING",
      "SALES",
      "DESIGN",
      "SOCIAL_MEDIA",
      "OPERATIONS",
      "CUSTOMER_SERVICE",
      "PRODUCT",
      "ENGINEERING",
      "CRYPTO",
      "OTHER"
    ])
  ),
  is_free: z.boolean(),
  website_url: z.string().nullable(),
  twitter_url: z.string().nullable(),
  linkedin_url: z.string().nullable(),
  youtube_url: z.string().nullable(),
  logo: z.string().nullable(),
  photo1: z.string().nullable(),
  photo2: z.string().nullable(),
  photo3: z.string().nullable(),
  created_at: z.string()
});

export type Agent = z.infer<typeof agentSchema>;
