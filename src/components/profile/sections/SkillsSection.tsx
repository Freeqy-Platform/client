import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Briefcase, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import type { User, UpdateUserSkillsRequest } from "../../../types/user";
import { SkillsEditor } from "../editors/SkillsEditor";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { skillsSchema } from "../../../lib/validations/profileSchemas";

interface SkillsSectionProps {
  user: User;
  onUpdate: (data: UpdateUserSkillsRequest) => Promise<void>;
  isUpdating: boolean;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  user,
  onUpdate,
  isUpdating,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);

  const form = useForm<UpdateUserSkillsRequest>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills: user.skills?.map((s) => s.name) || [],
    },
  });

  React.useEffect(() => {
    const skills = user.skills?.map((s) => s.name) || [];
    form.reset({ skills });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.skills]);

  const onSubmit = async (data: UpdateUserSkillsRequest) => {
    try {
      await onUpdate(data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating skills:", error);
    }
  };

  return (
    <Card className="mt-4 border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Skills
          </CardTitle>
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8">
                <Edit className="h-3.5 w-3.5 mr-1.5" />
                {user.skills && user.skills.length > 0 ? "Edit" : "Add"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-xl">Edit Skills</DialogTitle>
                <DialogDescription className="text-sm">
                  Add or remove your skills. Press Enter after each skill.
                </DialogDescription>
              </DialogHeader>
              <SkillsEditor
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

