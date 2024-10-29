'use client';

import { Suspense } from 'react';
import { AgentGrid } from '@/components/agent-grid';

interface AgentGridWrapperProps {
  initialSearchQuery?: string;
}

export function AgentGridWrapper({ initialSearchQuery = "" }: AgentGridWrapperProps) {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-[5%] py-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[9/16] bg-muted rounded-lg mb-4" />
                <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    }>
      <AgentGrid initialSearchQuery={initialSearchQuery} />
    </Suspense>
  );
} 