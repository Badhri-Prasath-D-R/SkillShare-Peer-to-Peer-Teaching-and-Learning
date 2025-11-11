import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Clock, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const skillColors = {
  programming: "bg-blue-100 text-blue-800",
  design: "bg-purple-100 text-purple-800", 
  business: "bg-green-100 text-green-800",
  language: "bg-yellow-100 text-yellow-800",
  music: "bg-pink-100 text-pink-800",
  other: "bg-gray-100 text-gray-800"
};

export default function RecentActivity({ mySessions, isLoading }) {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-600" />
          Your Sessions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-3 h-3 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : mySessions.length > 0 ? (
          <div className="space-y-4">
            {mySessions.map((session) => (
              <div key={session.id} className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-gray-200">
                <div className={`w-3 h-3 rounded-full mt-2 ${
                  session.status === 'upcoming' ? 'bg-blue-500' :
                  session.status === 'live' ? 'bg-green-500' : 
                  'bg-gray-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm">{session.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`${skillColors[session.skill_category]} text-xs`}>
                      {session.skill_category.replace('_', ' ')}
                    </Badge>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {session.current_participants}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {format(new Date(session.date + 'T' + session.time), "MMM d, h:mm a")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No sessions yet</p>
            <p className="text-sm">Create your first session to get started!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}