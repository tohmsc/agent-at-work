import { Suspense } from "react";
import { AgentGrid } from "@/components/agent-grid";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams.q || "";

  return (
    <main className="min-h-screen bg-background pt-8">
      <div className="container mx-auto px-6">
        <Suspense fallback={
          <div className="space-y-8">
            <h1 className="text-2xl font-bold">Loading...</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        }>
          <AgentGrid initialSearchQuery={searchQuery} />
        </Suspense>
      </div>
    </main>
  );
} 