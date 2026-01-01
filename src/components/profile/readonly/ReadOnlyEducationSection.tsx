import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { GraduationCap } from "lucide-react";
import type { User } from "../../../types/user";
import { getInstitutionName } from "../../../lib/utils/profileUtils";

interface ReadOnlyEducationSectionProps {
  user: User;
}

export const ReadOnlyEducationSection: React.FC<ReadOnlyEducationSectionProps> = ({
  user,
}) => {
  const educations = user.educations || [];

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="mt-4 border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <GraduationCap className="h-4 w-4" />
          Education
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {educations.length > 0 ? (
          <div className="space-y-4">
            {educations.map((edu) => (
              <div
                key={edu.id}
                className="border-l-2 border-muted pl-4 pb-4 last:pb-0"
              >
                <div className="space-y-1">
                  <h4 className="font-medium text-sm">
                    {getInstitutionName(edu)}
                  </h4>
                  {edu.degree && (
                    <p className="text-sm text-muted-foreground">
                      {edu.degree}
                    </p>
                  )}
                  {edu.fieldOfStudy && (
                    <p className="text-sm text-muted-foreground">
                      {edu.fieldOfStudy}
                    </p>
                  )}
                  {(edu.startDate || edu.endDate) && (
                    <p className="text-xs text-muted-foreground">
                      {formatDate(edu.startDate)} -{" "}
                      {edu.endDate ? formatDate(edu.endDate) : "Present"}
                    </p>
                  )}
                  {edu.grade && (
                    <p className="text-xs text-muted-foreground">
                      Grade: {edu.grade}
                    </p>
                  )}
                  {edu.description && (
                    <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">
                      {edu.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No education added yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

