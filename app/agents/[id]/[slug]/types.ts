export type Agent = {
  id: string;
  company: string;
  short_description: string;
  long_description: string;
  category: "Sales" | "Marketing" | "Design" | "Social_Media" | "Operations" | "Customer_Service" | "Product" | "Engineering" | "Crypto" | "Other";
  website?: string;
  // ... rest of the properties ...
}; 