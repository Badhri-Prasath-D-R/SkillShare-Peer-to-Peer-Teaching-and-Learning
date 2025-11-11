import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Target } from "lucide-react";

interface SkillsSectionProps {
  teachableSkills: string[];
  learningSkills: string[];
  onUpdateClick: () => void;
  'data-testid'?: string;
}

export function SkillsSection({ teachableSkills, learningSkills, onUpdateClick, 'data-testid': testId }: SkillsSectionProps) {
  return (
    <div className="space-y-6" data-testid={testId}>
      <div>
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          Skills You Can Teach
        </h4>
        <div className="flex flex-wrap gap-2" data-testid={`${testId}-teachable`}>
          {teachableSkills.map((skill) => (
            <Badge 
              key={skill} 
              className="bg-green-100 text-green-800 border border-green-200 px-2.5 py-0.5 rounded-full text-xs font-semibold"
              data-testid={`teachable-skill-${skill.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {skill}
            </Badge>
          ))}
          {teachableSkills.length === 0 && (
            <p className="text-sm text-gray-500">No skills added yet</p>
          )}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          Skills You Want to Learn
        </h4>
        <div className="flex flex-wrap gap-2" data-testid={`${testId}-learning`}>
          {learningSkills.map((skill) => (
            <Badge 
              key={skill} 
              className="bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1"
              data-testid={`learning-skill-${skill.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <Target className="w-3 h-3" />
              {skill}
            </Badge>
          ))}
          {learningSkills.length === 0 && (
            <p className="text-sm text-gray-500">No learning goals set yet</p>
          )}
        </div>
      </div>

      <Button 
        variant="outline" 
        onClick={onUpdateClick}
        className="w-full border border-gray-300 text-gray-700 hover:bg-orange-50 flex items-center justify-center gap-2"
        data-testid={`${testId}-update-button`}
      >
        <Plus className="w-4 h-4" />
        Update Your Skills
      </Button>
    </div>
  );
}
