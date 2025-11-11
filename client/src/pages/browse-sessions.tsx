import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SessionCard } from "@/components/session-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

export default function BrowseSessions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");

  const { data: user } = useQuery<any>({
    queryKey: ['/api/users/current'],
  });

  const { data: sessions, isLoading } = useQuery<any[]>({
    queryKey: ['/api/sessions'],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const filteredSessions = (sessions || []).filter((session: any) => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || categoryFilter === 'all' || session.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesLevel = !levelFilter || levelFilter === 'all' || session.level.toLowerCase() === levelFilter.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="browse-title">Browse Sessions</h1>
        <p className="text-gray-600">Find the perfect learning opportunity for you</p>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                data-testid="input-search-sessions"
              />
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]" data-testid="select-category-filter">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="programming">Programming</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="data science">Data Science</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="language">Language</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                </SelectContent>
              </Select>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-[150px]" data-testid="select-level-filter">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Grid */}
      <div className="grid grid-cols-1 gap-6" data-testid="sessions-grid">
        {filteredSessions.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No sessions found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or check back later for new sessions.</p>
            </CardContent>
          </Card>
        ) : (
          filteredSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              currentUserId={user?.id || ''}
              data-testid={`session-card-${session.id}`}
            />
          ))
        )}
      </div>
    </div>
  );
}
