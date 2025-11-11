import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { X } from "lucide-react";

export default function Profile() {
  const { toast } = useToast();
  
  const { data: user, isLoading } = useQuery<any>({
    queryKey: ['/api/users/current'],
  });

  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    teachableSkills: [] as string[],
    learningSkills: [] as string[],
  });

  const [newTeachableSkill, setNewTeachableSkill] = useState("");
  const [newLearningSkill, setNewLearningSkill] = useState("");

  // Initialize form data when user loads
  React.useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        bio: user.bio || "",
        teachableSkills: user.teachableSkills || [],
        learningSkills: user.learningSkills || [],
      });
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!user) throw new Error("User not found");
      return apiRequest("PUT", `/api/users/${user.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users/current'] });
      toast({
        title: "Success!",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const addTeachableSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTeachableSkill.trim()) {
      e.preventDefault();
      const skill = newTeachableSkill.trim();
      if (!formData.teachableSkills.includes(skill)) {
        setFormData(prev => ({
          ...prev,
          teachableSkills: [...prev.teachableSkills, skill]
        }));
      }
      setNewTeachableSkill("");
    }
  };

  const addLearningSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newLearningSkill.trim()) {
      e.preventDefault();
      const skill = newLearningSkill.trim();
      if (!formData.learningSkills.includes(skill)) {
        setFormData(prev => ({
          ...prev,
          learningSkills: [...prev.learningSkills, skill]
        }));
      }
      setNewLearningSkill("");
    }
  };

  const removeTeachableSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      teachableSkills: prev.teachableSkills.filter(skill => skill !== skillToRemove)
    }));
  };

  const removeLearningSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      learningSkills: prev.learningSkills.filter(skill => skill !== skillToRemove)
    }));
  };

  if (isLoading) {
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

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="profile-title">My Profile</h1>
        <p className="text-gray-600">Manage your skills and personal information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="profile-form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      data-testid="input-full-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      className="bg-gray-50"
                      readOnly
                      data-testid="input-email"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                    data-testid="textarea-bio"
                  />
                </div>

                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills You Can Teach
                  </Label>
                  <div className="flex flex-wrap gap-2 mb-2" data-testid="teachable-skills">
                    {formData.teachableSkills.map((skill) => (
                      <Badge 
                        key={skill} 
                        variant="secondary" 
                        className="bg-green-100 text-green-800 flex items-center gap-2"
                        data-testid={`teachable-skill-${skill.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeTeachableSkill(skill)}
                          className="text-green-600 hover:text-green-800"
                          data-testid={`remove-teachable-skill-${skill.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <Input
                    type="text"
                    placeholder="Add a skill..."
                    value={newTeachableSkill}
                    onChange={(e) => setNewTeachableSkill(e.target.value)}
                    onKeyPress={addTeachableSkill}
                    data-testid="input-add-teachable-skill"
                  />
                </div>

                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills You Want to Learn
                  </Label>
                  <div className="flex flex-wrap gap-2 mb-2" data-testid="learning-skills">
                    {formData.learningSkills.map((skill) => (
                      <Badge 
                        key={skill} 
                        variant="secondary" 
                        className="bg-blue-100 text-blue-800 flex items-center gap-2"
                        data-testid={`learning-skill-${skill.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeLearningSkill(skill)}
                          className="text-blue-600 hover:text-blue-800"
                          data-testid={`remove-learning-skill-${skill.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <Input
                    type="text"
                    placeholder="Add a skill..."
                    value={newLearningSkill}
                    onChange={(e) => setNewLearningSkill(e.target.value)}
                    onKeyPress={addLearningSkill}
                    data-testid="input-add-learning-skill"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={updateProfileMutation.isPending}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                  data-testid="button-update-profile"
                >
                  {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Profile Stats */}
        <div className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="font-bold text-gray-900">Your Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4" data-testid="profile-stats">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Points</span>
                  <span className="font-bold text-orange-600" data-testid="stat-points">{user.points}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sessions Hosted</span>
                  <span className="font-bold" data-testid="stat-hosted">{user.sessionsHosted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sessions Attended</span>
                  <span className="font-bold" data-testid="stat-attended">{user.sessionsAttended}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Rating</span>
                  <span className="font-bold text-yellow-600" data-testid="stat-rating">
                    {(user.averageRating / 10).toFixed(1)} ⭐
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="font-bold text-gray-900">Achievement Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3" data-testid="achievement-badges">
                <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="text-2xl mb-1">🏆</div>
                  <div className="text-xs font-medium text-yellow-800">Top Teacher</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-2xl mb-1">📚</div>
                  <div className="text-xs font-medium text-blue-800">Eager Learner</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl mb-1">⭐</div>
                  <div className="text-xs font-medium text-green-800">5-Star Host</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-2xl mb-1">🎯</div>
                  <div className="text-xs font-medium text-purple-800">Goal Crusher</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
