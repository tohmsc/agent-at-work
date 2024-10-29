'use server'

import { encodedRedirect } from "@/utils/utils";

export async function subscribeAction(formData: FormData) {
  const email = formData.get('email') as string;
  
  try {
    // Add your subscription logic here
    // For example: add to database, call newsletter API, etc.
    console.log('Subscription email:', email);
    return encodedRedirect("success", "/", "Thanks for subscribing! Check your email for confirmation.");
  } catch (error) {
    return encodedRedirect("error", "/", "Failed to subscribe. Please try again.");
  }
} 