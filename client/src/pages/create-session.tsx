import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertSessionSchema } from "@shared/schema";

export default function CreateSession() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { data: user } = useQuery<any>({
    queryKey: ['/api/users/current'],
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    level: "beginner",
    maxParticipants: 10,
    cost: 2,
    date: "",
    time: "",
    duration: 60,
  });

  const createSessionMutation = useMutation({
    mutationFn: async (data: any) => {
      // Combine date and time into datetime
      const datetime = new Date(`${data.date}T${data.time}`);
      
      const sessionData = {
        title: data.title,
        description: data.description,
        hostId: user?.id,
        category: data.category,
        level: data.level,
        maxParticipants: data.maxParticipants,
        cost: data.cost,
        datetime: datetime.toISOString(),
        duration: data.duration,
      };

      const result = insertSessionSchema.safeParse(sessionData);
      if (!result.success) {
        throw new Error("Invalid session data");
      }

      return apiRequest("POST", "/api/sessions", sessionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sessions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users/current'] });
      toast({
        title: "Success!",
        description: "Your session has been created successfully.",
      });
      setLocation('/');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create session. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a session.",
        variant: "destructive",
      });
      return;
    }
    createSessionMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="create-session-title">Create New Session</h1>
        <p className="text-gray-600">Share your knowledge with the community</p>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6" data-testid="create-session-form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Session Title
                </Label>
                <Input
                  id="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Introduction to React"
                  data-testid="input-session-title"
                />
              </div>
              <div>
                <Label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)} required>
                  <SelectTrigger data-testid="select-category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Programming">Programming</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Language">Language</SelectItem>
                    <SelectItem value="Music">Music</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </Label>
              <Textarea
                id="description"
                rows={4}
                required
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what you'll teach..."
                data-testid="textarea-description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  data-testid="input-date"
                />
              </div>
              <div>
                <Label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  data-testid="input-time"
                />
              </div>
              <div>
                <Label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                  min={30}
                  max={180}
                  data-testid="input-duration"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-2">
                  Max Participants
                </Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value))}
                  min={1}
                  max={50}
                  data-testid="input-max-participants"
                />
              </div>
              <div>
                <Label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </Label>
                <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
                  <SelectTrigger data-testid="select-level">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-2">
                  Cost (Points)
                </Label>
                <Input
                  id="cost"
                  type="number"
                  value={formData.cost}
                  onChange={(e) => handleInputChange('cost', parseInt(e.target.value))}
                  min={1}
                  max={10}
                  data-testid="input-cost"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setLocation('/')}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createSessionMutation.isPending}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                data-testid="button-create-session"
              >
                {createSessionMutation.isPending ? "Creating..." : "Create Session"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
