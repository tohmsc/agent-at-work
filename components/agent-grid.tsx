"use client";

import { AgentCard } from "./agent-card";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { categoryConfig } from "./agent-card";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "./ui/badge";
import { createClient } from "@/utils/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "@/components/ui/icons";
import { Input } from "./ui/input";
import { Search } from "lucide-react";


type Agent = {
  id: string;
  company: string;
  short_description: string;
  category: keyof typeof categoryConfig;
  is_free: boolean;
  logo?: string;
};

const ITEMS_PER_PAGE = 24;

export function AgentGrid({ initialSearchQuery = "" }: { initialSearchQuery?: string }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Combined useEffect for fetching agents and handling search
  useEffect(() => {
    async function fetchAgents() {
      setLoading(true);
      setError(null);
      
      try {
        const supabase = createClient();
        let query = supabase
          .from('submissions')
          .select(`
            id,
            company,
            short_description,
            category,
            is_free,
            logo
          `)
          .eq('status', 'approved');

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
          throw new Error(error.message);
        }
        setAgents(data || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load agents';
        setError(errorMessage);
        console.error('Error fetching agents:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAgents();
    setSearchQuery(initialSearchQuery); // Update search query when initialSearchQuery changes
  }, [initialSearchQuery]); // Only depend on initialSearchQuery

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  // Filter agents based on search query and category
  const filteredAgents = agents
    .filter(agent => !selectedCategory || agent.category === selectedCategory)
    .filter(agent => 
      searchQuery === "" || 
      agent.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.short_description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const totalPages = Math.ceil(filteredAgents.length / ITEMS_PER_PAGE);
  const paginatedAgents = filteredAgents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (error) {
    return (
      <div className="container mx-auto px-[5%] py-16">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
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
    );
  }

  return (
    <div className="container mx-auto px-[5%] py-16 bg-background">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Badge className="h-8 px-3 text-sm bg-secondary text-secondary-foreground">
              {filteredAgents.length} {filteredAgents.length === 1 ? 'Agent' : 'Agents'}
            </Badge>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full sm:w-[200px]"
              />
            </div>

            <Select
              value={selectedCategory || "_all"}
              onValueChange={(value) => setSelectedCategory(value === "_all" ? null : value)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">
                  <div className="flex items-center gap-2">
                    All Categories
                  </div>
                </SelectItem>
                {Object.entries(categoryConfig).map(([category, config]) => {
                  const CategoryIcon = config.icon;
                  const count = agents.filter(agent => agent.category === category).length;
                  return (
                    <SelectItem key={category} value={category}>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <CategoryIcon className="h-4 w-4" />
                          {category.replace('_', ' ')}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {count}
                        </span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          layout
        >
          <AnimatePresence mode="popLayout">
            {paginatedAgents.length > 0 ? (
              paginatedAgents.map((agent) => (
                <motion.div
                  key={agent.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    opacity: { duration: 0.3 },
                    layout: { duration: 0.3 },
                    scale: { duration: 0.2 }
                  }}
                >
                  <AgentCard 
                    {...{
                      ...agent,
                      shortDescription: agent.short_description,
                      isFree: agent.is_free,
                      image: agent.logo || '/placeholder-image.jpg'
                    }} 
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12"
              >
                <p className="text-muted-foreground">No agents found matching your criteria.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  onClick={() => setCurrentPage(i + 1)}
                  className="w-10"
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
