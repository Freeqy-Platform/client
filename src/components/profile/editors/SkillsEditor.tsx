import React, { useState } from "react";
import { Form } from "../../ui/form";
import { FormField, FormItem, FormControl, FormMessage } from "../../ui/form";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { X } from "lucide-react";
import { DialogFooter } from "../../ui/dialog";
import type { UseFormReturn } from "react-hook-form";
import type { UpdateUserSkillsRequest } from "../../../types/user";

interface SkillsEditorProps {
  form: UseFormReturn<UpdateUserSkillsRequest>;
  onSubmit: (data: UpdateUserSkillsRequest) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const SkillsEditor: React.FC<SkillsEditorProps> = ({
  form,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const [skillInput, setSkillInput] = useState("");
  const skills = form.watch("skills") || [];

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      form.setValue("skills", [...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (index: number) => {
    form.setValue(
      "skills",
      skills.filter((_, i) => i !== index)
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Add Skills</Label>
          <div className="flex gap-2">
            <Input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder="Type a skill and press Enter"
              className="h-9"
            />
            <Button type="button" onClick={addSkill} size="sm" className="h-9">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3 min-h-[2.5rem] p-2 border rounded-md bg-muted/50">
            {skills.length > 0 ? (
              skills.map((skill: string, index: number) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="gap-1.5 text-xs"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="ml-0.5 hover:text-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">
                No skills added yet
              </p>
            )}
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={onCancel} size="sm">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} size="sm">
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

