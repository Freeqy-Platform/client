import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { GraduationCap } from "lucide-react";
import type { User } from "../../../types/user";
import { getInstitutionName } from "../../../lib/utils/profileUtils";

interface EducationSectionViewProps {
  user: User;
}

export const EducationSectionView: React.FC<EducationSectionViewProps> = ({
  user,
}) => {
  return (
    <Card className="mt-4 border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <GraduationCap className="h-4 w-4" />
          Education
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {user.educations && user.educations.length > 0 ? (
          <div className="space-y-4">
            {user.educations.map((edu, index) => (
              <div
                key={index}
                className="relative pl-4 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-[var(--purple)] before:rounded-full"
              >
                <h4 className="font-semibold text-sm">
                  {edu.degree || "Degree not specified"}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {getInstitutionName(edu)}
                </p>
                {edu.fieldOfStudy && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {edu.fieldOfStudy}
                  </p>
                )}
                {edu.startDate && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {edu.startDate} - {edu.endDate || "Present"}
                  </p>
                )}
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

