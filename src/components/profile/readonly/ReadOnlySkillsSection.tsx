import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Briefcase } from "lucide-react";
import type { User } from "../../../types/user";

interface ReadOnlySkillsSectionProps {
  user: User;
}

export const ReadOnlySkillsSection: React.FC<ReadOnlySkillsSectionProps> = ({
  user,
}) => {
  const skills = user.skills || [];

  return (
    <Card className="mt-4 border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Briefcase className="h-4 w-4" />
          Skills
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge
                key={skill.id}
                variant="secondary"
                className="text-sm font-normal px-3 py-1"
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

