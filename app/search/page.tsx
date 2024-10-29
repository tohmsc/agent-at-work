import { AgentGrid } from "@/components/agent-grid";
import { Suspense } from "react";

interface SearchPageProps {
  searchParams: { q?: string };
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  // Await the searchParams resolution
  const resolvedParams = await Promise.resolve(searchParams);
  const searchQuery = resolvedParams.q || "";

  return (
    <main className="min-h-screen bg-background pt-8">
      <div className="container mx-auto px-6">
        <Suspense fallback={<div>Loading...</div>}>
          <h1 className="text-2xl font-bold mb-8">
            {searchQuery ? `Search results for "${searchQuery}"` : "Search Results"}
          </h1>
          <AgentGrid initialSearchQuery={searchQuery} />
        </Suspense>
      </div>
    </main>
  );
} 