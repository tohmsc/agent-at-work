"use server"

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const emailSchema = z.string().email("Invalid email address");

export async function subscribeAction(formData: FormData) {
  try {
    const email = emailSchema.parse(formData.get("email"));
    const supabase = await createClient();
    
    const { data: existingSubscriber } = await supabase
      .from('subscriptions')
      .select()
      .eq('email', email)
      .single();

    if (existingSubscriber) {
      return { error: "You're already subscribed!" };
    }
    
    const { error } = await supabase
      .from('subscriptions')
      .insert([{ email }]);

    if (error) {
      console.error('Subscription error:', error);
      return { error: "Failed to subscribe. Please try again." };
    }

    revalidatePath('/');
    return { success: "Thanks for subscribing!" };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { error: err.errors[0].message };
    }
    return { error: "Something went wrong. Please try again." };
  }
} 