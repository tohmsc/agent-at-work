"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { categories } from "@/types/shared";
import { ImageUpload } from "@/components/ui/image-upload";

// URL validation patterns
const urlPatterns = {
  twitter: /^https?:\/\/(www\.)?twitter\.com\/.+/i,
  linkedin: /^https?:\/\/(www\.)?linkedin\.com\/.+/i,
  youtube: /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/i,
};

const formSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  short_description: z.string()
    .min(1, "Description is required")
    .max(80, "Description must be 80 characters or less"),
  long_description: z.string()
    .min(1, "Description is required")
    .max(2500, "Description must be 2500 characters or less"),
  is_free: z.boolean().default(false),
  website_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  twitter_url: z.string()
    .regex(urlPatterns.twitter, "Invalid Twitter URL")
    .optional()
    .or(z.literal("")),
  linkedin_url: z.string()
    .regex(urlPatterns.linkedin, "Invalid LinkedIn URL")
    .optional()
    .or(z.literal("")),
  youtube_url: z.string()
    .regex(urlPatterns.youtube, "Invalid YouTube URL")
    .optional()
    .or(z.literal("")),
  category: z.enum(categories),
  photo1: z.instanceof(File).optional(),
  photo2: z.instanceof(File).optional(),
  photo3: z.instanceof(File).optional(),
  logo: z.instanceof(File).optional(),
  header_image: z.instanceof(File).optional(),
});

type FormValues = z.infer<typeof formSchema>;

function CharacterCount({ current, max }: { current: number; max: number }) {
  const isClose = current >= max * 0.9;
  const isAtLimit = current >= max;
  
  return (
    <span className={`text-sm ${
      isAtLimit ? 'text-destructive' : 
      isClose ? 'text-warning' : 
      'text-muted-foreground'
    }`}>
      {current}/{max} characters
    </span>
  );
}

export function SubmissionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      is_free: false,
      short_description: "",
      long_description: "",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true);
      const supabase = createClient();

      // Upload images to Supabase Storage
      const uploadImage = async (file: File | null, path: string) => {
        if (!file) return null;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from('submissions')
          .upload(`${path}/${fileName}`, file);
        
        if (error) throw error;
        return data.path;
      };

      // Upload all images in parallel
      const [photo1Path, photo2Path, photo3Path, logoPath, headerPath] = await Promise.all([
        uploadImage(values.photo1 || null, 'photos'),
        uploadImage(values.photo2 || null, 'photos'),
        uploadImage(values.photo3 || null, 'photos'),
        uploadImage(values.logo || null, 'logos'),
        uploadImage(values.header_image || null, 'headers')
      ]);

      // Insert submission with image paths
      const { error } = await supabase
        .from('submissions')
        .insert([{
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          company: values.company,
          short_description: values.short_description,
          long_description: values.long_description,
          is_free: values.is_free,
          website_url: values.website_url || null,
          twitter_url: values.twitter_url || null,
          linkedin_url: values.linkedin_url || null,
          youtube_url: values.youtube_url || null,
          category: values.category,
          photo1: photo1Path,
          photo2: photo2Path,
          photo3: photo3Path,
          logo: logoPath,
          header_image: headerPath,
          status: 'pending'
        }]);

      if (error) throw error;

      toast.success('Product submitted successfully!');
      window.location.href = '/';
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Get current character counts
  const shortDescLength = form.watch("short_description")?.length || 0;
  const longDescLength = form.watch("long_description")?.length || 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Personal Information Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">About You</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Product Information Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">About the Product</h2>

          <FormField
            control={form.control}
            name="short_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>One Line Description</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={80} />
                </FormControl>
                <div className="flex justify-between">
                  <FormDescription>
                    Brief description of your product
                  </FormDescription>
                  <CharacterCount current={shortDescLength} max={80} />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="long_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>About Description</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    maxLength={600}
                    className="min-h-[100px]"
                  />
                </FormControl>
                <div className="flex justify-between">
                  <FormDescription>
                    Detailed description of your product
                  </FormDescription>
                  <CharacterCount current={longDescLength} max={600} />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_free"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pricing</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value === "free")}
                  defaultValue={field.value ? "free" : "paid"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pricing" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website Link</FormLabel>
                <FormControl>
                  <Input {...field} type="url" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="twitter_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Twitter/X Link</FormLabel>
                <FormControl>
                  <Input {...field} type="url" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="linkedin_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn Link</FormLabel>
                <FormControl>
                  <Input {...field} type="url" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="youtube_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>YouTube Link</FormLabel>
                <FormControl>
                  <Input {...field} type="url" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Image Upload Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Images</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <ImageUpload
                    label="Logo"
                    onChange={field.onChange}
                    value={field.value}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="header_image"
              render={({ field }) => (
                <FormItem>
                  <ImageUpload
                    label="Header Image"
                    onChange={field.onChange}
                    value={field.value}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="photo1"
              render={({ field }) => (
                <FormItem>
                  <ImageUpload
                    label="Photo 1"
                    onChange={field.onChange}
                    value={field.value}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="photo2"
              render={({ field }) => (
                <FormItem>
                  <ImageUpload
                    label="Photo 2"
                    onChange={field.onChange}
                    value={field.value}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="photo3"
              render={({ field }) => (
                <FormItem>
                  <ImageUpload
                    label="Photo 3"
                    onChange={field.onChange}
                    value={field.value}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Submitting..." : "Submit Product"}
        </Button>
      </form>
    </Form>
  );
}
