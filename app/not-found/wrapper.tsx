'use client';

import dynamic from 'next/dynamic';

const DynamicContent = dynamic(
  () => import('./search-params').then(mod => mod.SearchParamsContent),
  { 
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-muted-foreground mb-6">Loading...</p>
      </div>
    )
  }
);

export function ClientWrapper() {
  return <DynamicContent />;
} 