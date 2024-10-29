'use client';

import { useSearchParams } from 'next/navigation';

export function SearchParamsContent() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from');

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-muted-foreground mb-6">
        {from 
          ? `Sorry, the page "${from}" could not be found.`
          : "Sorry, the page you're looking for could not be found."}
      </p>
      <a
        href="/"
        className="text-primary hover:underline"
      >
        Return to Home
      </a>
    </div>
  );
} 