"use client";

import { Input } from "@/components/ui/input";
import { FormControl, FormDescription } from "@/components/ui/form";

interface UrlInputProps {
  field: any;
  placeholder: string;
  description?: string;
}

export function UrlInput({ field, placeholder, description }: UrlInputProps) {
  const formatUrl = (value: string) => {
    if (!value) return value;
    if (!value.startsWith('http://') && !value.startsWith('https://')) {
      return `https://${value}`;
    }
    return value;
  };

  return (
    <FormControl>
      <Input
        {...field}
        type="url"
        placeholder={placeholder}
        onChange={(e) => {
          field.onChange(formatUrl(e.target.value));
        }}
      />
      {description && (
        <FormDescription>{description}</FormDescription>
      )}
    </FormControl>
  );
}
