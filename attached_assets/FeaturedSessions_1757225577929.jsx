
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Clock, Users, Star, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Session } from "@/entities/Session";
import { User } from "@/entities/User";

const skillColors = {
  programming: "bg-blue-100 text-blue-800 border-blue-200",
  design: "bg-purple-100 text-purple-800 border-purple-200", 
  business: "bg-green-100 text-green-800 border-green-200",
  language: "bg-yellow-100 text-yellow-800 border-yellow-200",
  music: "bg-pink-100 text-pink-800 border-pink-200",
  writing: "bg-indigo-100 text-indigo-800 border-indigo-200",
  cooking: "bg-orange-100 text-orange-800 border-orange-200",
  fitness: "bg-red-100 text-red-800 border-red-200",
  photography: "bg-cyan-100 text-cyan-800 border-cyan-200",
  marketing: "bg-teal-100 text-teal-800 border-teal-200",
  data_science: "bg-violet-100 text-violet-800 border-violet-200",
  art: "bg-rose-100 text-rose-800 border-rose-200",
  public_speaking: "bg-amber-100 text-amber-800 border-amber-200",
  other: "bg-gray-100 text-gray-800 border-gray-200"
};

export default function FeaturedSessions({ sessions, isLoading, user }) {
  const handleJoinSession = async (sessionId) => {
    try {
      const session = sessions.find(s => s.id === sessionId);
      if (!session || !user) return;

      if (user.points < session.cost_points) {
        alert("You don't have enough points to join this session!");
        return;
      }

      const updatedSession = {
        ...session,
        current_participants: session.current_participants + 1,
        participant_emails: [...(session.participant_emails || []), user.email]
      };

      await Session.update(sessionId, updatedSession);
      
      const sessionToUpdate = sessions.find(s => s.id === sessionId);
      if (!sessionToUpdate) return;
      
      await User.updateMyUserData({
        points: user.points - sessionToUpdate.cost_points,
        sessions_attended: (user.sessions_attended || 0) + 1
      });

      alert("Successfully joined the session!");
      window.location.reload();
    } catch (error) {
      console.error("Error joining session:", error);
      alert("Error joining session. Please try again.");
    }
  };

  const handleUnenrollSession = async (sessionId) => {
    try {
      const session = sessions.find(s => s.id === sessionId);
      if (!session || !user) return;

      if (!session.participant_emails?.includes(user.email)) {
        alert("You are not enrolled in this session.");
        return;
      }

      const updatedSession = {
        ...session,
        current_participants: session.current_participants - 1,
        participant_emails: (session.participant_emails || []).filter(email => email !== user.email)
      };

      await Session.update(sessionId, updatedSession);

      // Refund points and update user stats
      await User.updateMyUserData({
        points: (user.points || 0) + session.cost_points,
        sessions_attended: Math.max(0, (user.sessions_attended || 0) - 1)
      });
      
      alert("Successfully unenrolled from the session!");
      window.location.reload();
    } catch (error) {
      console.error("Error unenrolling from session:", error);
      alert("Error unenrolling from session. Please try again.");
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-orange-600" />
          Featured Sessions
        </CardTitle>
        <p className="text-gray-600">Discover amazing learning opportunities</p>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="grid gap-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="p-4 border border-gray-200 rounded-xl">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3 flex-1">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {sessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300 bg-white/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3 flex-1">
                    <Avatar className="w-12 h-12 border-2 border-gray-200">
                      <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white font-semibold">
                        {session.host_name?.split(' ').map(n => n[0]).join('') || 'H'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">{session.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{session.description}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(session.date + 'T' + session.time), "MMM d, h:mm a")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {session.current_participants}/{session.max_participants}
                        </span>
                        {session.rating_average > 0 && (
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            {session.rating_average.toFixed(1)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${skillColors[session.skill_category]} border text-xs`}>
                          {session.skill_category.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {session.cost_points} points
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                          {session.difficulty_level}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-center">
                    {(() => {
                      if (!user) return null;
                      if (session.host_email === user.email) {
                        return (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            Your Session
                          </Badge>
                        );
                      }
                      if (session.participant_emails?.includes(user.email)) {
                        return (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUnenrollSession(session.id)}
                            className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            Unenroll
                          </Button>
                        );
                      }
                      return (
                        <Button
                          size="sm"
                          onClick={() => handleJoinSession(session.id)}
                          disabled={session.current_participants >= session.max_participants}
                          className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                        >
                          {session.current_participants >= session.max_participants ? "Full" : "Join Session"}
                        </Button>
                      );
                    })()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
