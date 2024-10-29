'use client';

import Link from 'next/link';

export function NotFoundContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-muted-foreground mb-6">
        Sorry, the page you're looking for could not be found.
      </p>
      <Link
        href="/"
        className="text-primary hover:underline"
      >
        Return to Home
      </Link>
    </div>
  );
} 