import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { GraduationCap, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import type { User, UpdateEducationsRequest } from "../../../types/user";
import { EducationEditor } from "../editors/EducationEditor";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { educationSchema } from "../../../lib/validations/profileSchemas";
import { getInstitutionName } from "../../../lib/utils/profileUtils";

interface EducationSectionProps {
  user: User;
  onUpdate: (data: UpdateEducationsRequest) => Promise<void>;
  isUpdating: boolean;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  user,
  onUpdate,
  isUpdating,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);

  const form = useForm<UpdateEducationsRequest>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      educations: (user.educations as UpdateEducationsRequest["educations"]) || [],
    },
  });

  React.useEffect(() => {
    form.reset({
      educations: (user.educations as UpdateEducationsRequest["educations"]) || [],
    });
  }, [user, form]);

  const onSubmit = async (data: UpdateEducationsRequest) => {
    try {
      await onUpdate(data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating education:", error);
    }
  };

  return (
    <Card className="mt-4 border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Education
          </CardTitle>
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                {user.educations && user.educations.length > 0 ? "Edit" : "Add"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">Edit Education</DialogTitle>
                <DialogDescription className="text-sm">
                  Add your educational background.
                </DialogDescription>
              </DialogHeader>
              <EducationEditor
                form={form}
                onSubmit={onSubmit}
                onCancel={() => setIsEditing(false)}
                isLoading={isUpdating}
              />
            </DialogContent>
          </Dialog>
        </div>
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

