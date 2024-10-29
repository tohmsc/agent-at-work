"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchLogoFromLogoApi } from "@/utils/logo";
import { createClient } from "@/utils/supabase/client";

const ROTATION_INTERVAL = 3000;
const SAMPLE_SIZE = 5;

export function LogoStack() {
  const [logos, setLogos] = useState<string[]>([]);
  const [currentLogos, setCurrentLogos] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRandomWebsites() {
      try {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          throw new Error('Missing Supabase environment variables');
        }

        const supabase = createClient();
        const { data, error } = await supabase
          .from('submissions')
          .select('website_url')
          .not('website_url', 'is', null)
          .limit(SAMPLE_SIZE);

        if (error) throw error;

        if (data && data.length > 0) {
          const websites = data.map(item => item.website_url).filter(Boolean);
          const fetchedLogos = await Promise.all(
            websites.map(async (url) => {
              const logo = await fetchLogoFromLogoApi(url);
              return logo || '/placeholder-image.jpg';
            })
          );
          setLogos(fetchedLogos);
          setCurrentLogos(fetchedLogos);
        } else {
          const defaultLogos = Array(3).fill('/placeholder-image.jpg');
          setLogos(defaultLogos);
          setCurrentLogos(defaultLogos);
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch logos');
        const defaultLogos = Array(3).fill('/placeholder-image.jpg');
        setLogos(defaultLogos);
        setCurrentLogos(defaultLogos);
      }
    }
    fetchRandomWebsites();
  }, []);

  useEffect(() => {
    if (logos.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentLogos((prev) => [...prev.slice(1), prev[0]]);
    }, ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [logos]);

  return (
    <div className="flex justify-center items-center h-16 mb-8">
      <div className="relative w-14 h-14">
        <AnimatePresence mode="popLayout">
          {currentLogos.slice(0, 3).map((logo, index) => (
            <motion.div
              key={`${logo}-${index}`}
              className="absolute w-14 h-14 rounded-2xl bg-white shadow-md overflow-hidden"
              style={{
                zIndex: 3 - index
              }}
              initial={{ 
                scale: 0.8, 
                opacity: 0, 
                y: 20
              }}
              animate={{
                scale: 1 - index * 0.05,
                opacity: 1 - index * 0.2,
                y: -(index * 4)
              }}
              exit={{ 
                scale: 0.8, 
                opacity: 0, 
                y: -20
              }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={logo}
                alt="Company logo"
                fill
                className="object-contain p-2"
                unoptimized
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
} 