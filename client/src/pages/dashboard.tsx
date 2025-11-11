import { useQuery } from "@tanstack/react-query";
import { StatsCard } from "@/components/stats-card";
import { SessionCard } from "@/components/session-card";
import { SkillsSection } from "@/components/skills-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, Presentation, GraduationCap, Star, Brain, Clock, Plus } from "lucide-react";
import { useLocation } from "wouter";
import { format } from "date-fns";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  
  const { data: user, isLoading: userLoading } = useQuery<any>({
    queryKey: ['/api/users/current'],
  });

  const { data: sessions, isLoading: sessionsLoading } = useQuery<any[]>({
    queryKey: ['/api/sessions'],
  });

  if (userLoading || sessionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">User not found</h2>
          <p className="text-gray-600">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  const featuredSessions = (sessions || []).slice(0, 3);
  const userSessions = (sessions || []).filter((session: any) => 
    session.hostId === user?.id || (session.participants || []).includes(user?.id)
  ).slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="dashboard-welcome">
          Welcome back, {user.fullName.split(' ')[0]}!
        </h1>
        <p className="text-gray-600">Ready to learn something new or share your expertise?</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Learning Points"
          value={user.points}
          icon={Coins}
          trend="+3 this week"
          className="bg-orange-500"
          data-testid="stats-points"
        />
        <StatsCard
          title="Sessions Hosted"
          value={user.sessionsHosted}
          icon={Presentation}
          trend="+1 this month"
          className="bg-blue-500"
          data-testid="stats-hosted"
        />
        <StatsCard
          title="Sessions Attended"
          value={user.sessionsAttended}
          icon={GraduationCap}
          trend="+2 this week"
          className="bg-purple-500"
          data-testid="stats-attended"
        />
        <StatsCard
          title="Average Rating"
          value={(user.averageRating / 10).toFixed(1)}
          icon={Star}
          trend="Excellent!"
          className="bg-yellow-500"
          data-testid="stats-rating"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Featured Sessions */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-6 h-6 text-orange-600" />
                Featured Sessions
              </CardTitle>
              <p className="text-gray-600">Discover amazing learning opportunities</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4" data-testid="featured-sessions">
                {featuredSessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    currentUserId={user.id}
                    data-testid={`session-card-${session.id}`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Skills Overview */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Brain className="w-5 h-5 text-orange-600" />
                Your Skills Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <SkillsSection
                teachableSkills={user.teachableSkills}
                learningSkills={user.learningSkills}
                onUpdateClick={() => setLocation('/profile')}
                data-testid="skills-section"
              />
            </CardContent>
          </Card>

          {/* Your Sessions */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                Your Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6" data-testid="user-sessions">
              <div className="space-y-4">
                {userSessions.map((session) => {
                  const isHost = session.hostId === user.id;
                  const statusColor = session.isCompleted ? 'bg-gray-400' : 
                                    isHost ? 'bg-blue-500' : 'bg-green-500';
                  
                  return (
                    <div key={session.id} className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-gray-200" data-testid={`user-session-${session.id}`}>
                      <div className={`w-3 h-3 rounded-full mt-2 ${statusColor}`}></div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm" data-testid={`session-title-${session.id}`}>
                          {session.title} {isHost && '(Hosting)'}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs" data-testid={`session-category-${session.id}`}>
                            {session.category}
                          </Badge>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <span>{session.currentParticipants}</span>
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1" data-testid={`session-date-${session.id}`}>
                          {format(new Date(session.datetime), 'MMM d, h:mm a')}
                          {session.isCompleted && ' (Completed)'}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {userSessions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p className="mb-4">No sessions yet</p>
                    <Button 
                      onClick={() => setLocation('/browse')} 
                      variant="outline"
                      data-testid="button-browse-sessions"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Browse Sessions
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
