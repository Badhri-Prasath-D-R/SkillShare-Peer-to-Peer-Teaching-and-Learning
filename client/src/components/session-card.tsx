import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Clock, Users, Star, Video } from "lucide-react";
import { format } from "date-fns";
import { useLocation } from "wouter";

interface SessionCardProps {
  session: any;
  currentUserId: string;
  'data-testid'?: string;
}

export function SessionCard({ session, currentUserId, 'data-testid': testId }: SessionCardProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const isEnrolled = session.participants.includes(currentUserId);
  const isHost = session.hostId === currentUserId;
  const isFull = session.currentParticipants >= session.maxParticipants;

  const joinSessionMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/sessions/${session.id}/join`, { userId: currentUserId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sessions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users/current'] });
      toast({
        title: "Success!",
        description: "You have successfully joined the session.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to join session. You may not have enough points.",
        variant: "destructive",
      });
    },
  });

  const leaveSessionMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/sessions/${session.id}/leave`, { userId: currentUserId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sessions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users/current'] });
      toast({
        title: "Success!",
        description: "You have successfully left the session.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to leave session.",
        variant: "destructive",
      });
    },
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Programming': 'bg-blue-100 text-blue-800 border-blue-200',
      'Design': 'bg-purple-100 text-purple-800 border-purple-200',
      'Data Science': 'bg-violet-100 text-violet-800 border-violet-200',
      'Business': 'bg-green-100 text-green-800 border-green-200',
      'Language': 'bg-pink-100 text-pink-800 border-pink-200',
      'Music': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getHostInitials = (hostName: string) => {
    return hostName.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const hostName = session.host?.fullName || 'Unknown Host';
  const hostInitials = getHostInitials(hostName);

  return (
    <Card className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300 bg-white/50" data-testid={testId}>
      <CardContent className="p-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3 flex-1">
            <Avatar className="w-12 h-12 border-2 border-gray-200">
              <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white font-semibold">
                {hostInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 mb-1" data-testid={`${testId}-title`}>
                {session.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2" data-testid={`${testId}-description`}>
                {session.description}
              </p>
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span data-testid={`${testId}-datetime`}>
                    {format(new Date(session.datetime), 'MMM d, h:mm a')}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span data-testid={`${testId}-participants`}>
                    {session.currentParticipants}/{session.maxParticipants}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span data-testid={`${testId}-rating`}>
                    {(session.rating / 10).toFixed(1)}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getCategoryColor(session.category)}`} data-testid={`${testId}-category`}>
                  {session.category}
                </Badge>
                <Badge variant="outline" className="text-xs" data-testid={`${testId}-cost`}>
                  {session.cost} points
                </Badge>
                <Badge variant="outline" className="text-xs capitalize" data-testid={`${testId}-level`}>
                  {session.level}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-center">
            {isHost ? (
              <>
                <Badge className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium" data-testid={`${testId}-host-badge`}>
                  Host
                </Badge>
                <Button
                  size="sm"
                  onClick={() => setLocation(`/meeting/${session.id}`)}
                  className="bg-green-600 hover:bg-green-700 text-white text-xs"
                  data-testid={`${testId}-start-meeting-button`}
                >
                  <Video className="w-3 h-3 mr-1" />
                  Start Meeting
                </Button>
              </>
            ) : isEnrolled ? (
              <>
                <Badge className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium" data-testid={`${testId}-enrolled-badge`}>
                  Enrolled
                </Badge>
                <Button
                  size="sm"
                  onClick={() => setLocation(`/meeting/${session.id}`)}
                  className="bg-green-600 hover:bg-green-700 text-white text-xs"
                  data-testid={`${testId}-join-meeting-button`}
                >
                  <Video className="w-3 h-3 mr-1" />
                  Join Meeting
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => leaveSessionMutation.mutate()}
                  disabled={leaveSessionMutation.isPending}
                  className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 text-xs"
                  data-testid={`${testId}-leave-button`}
                >
                  {leaveSessionMutation.isPending ? "Leaving..." : "Leave"}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => joinSessionMutation.mutate()}
                disabled={joinSessionMutation.isPending || isFull}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                data-testid={`${testId}-join-button`}
              >
                {joinSessionMutation.isPending 
                  ? "Joining..." 
                  : isFull 
                    ? "Full" 
                    : "Join Session"
                }
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
