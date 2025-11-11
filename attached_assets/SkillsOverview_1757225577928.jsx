import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";

export default function SkillsOverview({ user }) {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Brain className="w-5 h-5 text-orange-600" />
          Your Skills Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            Skills You Can Teach
          </h4>
          <div className="flex flex-wrap gap-2">
            {user?.skills_known?.length > 0 ? (
              user.skills_known.map((skill, index) => (
                <Badge key={index} className="bg-green-100 text-green-800 border-green-200">
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No skills added yet</p>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            Skills You Want to Learn
          </h4>
          <div className="flex flex-wrap gap-2">
            {user?.skills_wanted?.length > 0 ? (
              user.skills_wanted.map((skill, index) => (
                <Badge key={index} className="bg-blue-100 text-blue-800 border-blue-200">
                  <Target className="w-3 h-3 mr-1" />
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No learning goals set</p>
            )}
          </div>
        </div>

        <Link to={createPageUrl("Profile")} className="block">
          <Button variant="outline" className="w-full justify-center hover:bg-orange-50 transition-all duration-200">
            <Plus className="w-4 h-4 mr-2" />
            Update Your Skills
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}