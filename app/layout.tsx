import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';
import { ErrorBoundary } from '@/components/error-boundary';

export const metadata = {
  title: "Agent at Work",
  description: "Discover and integrate AI agents to automate your workflow",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/icon.svg",
        color: "#000000",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/icon.svg",
        color: "#ffffff",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className={GeistSans.className}>
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
            <Analytics />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
