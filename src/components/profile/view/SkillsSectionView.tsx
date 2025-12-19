import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Briefcase } from "lucide-react";
import type { User } from "../../../types/user";

interface SkillsSectionViewProps {
  user: User;
}

export const SkillsSectionView: React.FC<SkillsSectionViewProps> = ({
  user,
}) => {
  return (
    <Card className="mt-4 border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Briefcase className="h-4 w-4" />
          Skills
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {user.skills && user.skills.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {user.skills.map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs font-medium"
              >
                {skill.name}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No skills added yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

