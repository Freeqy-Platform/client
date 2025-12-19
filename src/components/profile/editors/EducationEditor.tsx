import React from "react";
import { Form } from "../../ui/form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../ui/form";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import { Plus, X } from "lucide-react";
import { DialogFooter } from "../../ui/dialog";
import type { UseFormReturn } from "react-hook-form";
import type { UpdateEducationsRequest, EducationRequest } from "../../../types/user";

interface EducationEditorProps {
  form: UseFormReturn<UpdateEducationsRequest>;
  onSubmit: (data: UpdateEducationsRequest) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const EducationEditor: React.FC<EducationEditorProps> = ({
  form,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const educations = form.watch("educations") || [];

  const addEducation = () => {
    form.setValue("educations", [
      ...educations,
      {
        institutionName: "",
        degree: null,
        fieldOfStudy: null,
        startDate: null,
        endDate: null,
        grade: null,
        description: null,
      },
    ]);
  };

  const removeEducation = (index: number) => {
    form.setValue(
      "educations",
      educations.filter((_, i) => i !== index)
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <div className="space-y-3">
          {educations.map((edu: EducationRequest, index: number) => (
            <div
              key={index}
              className="border rounded-lg p-3 space-y-2.5 bg-muted/30"
            >
              <div className="flex justify-between items-center pb-2 border-b">
                <h4 className="font-semibold text-sm">
                  Education #{index + 1}
                </h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEducation(index)}
                  className="h-7 w-7 p-0"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
              <FormField
                control={form.control}
                name={`educations.${index}.institutionName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">
                      Institution Name *
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="h-8 text-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name={`educations.${index}.degree`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Degree</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ""}
                          className="h-8 text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`educations.${index}.fieldOfStudy`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Field of Study</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ""}
                          className="h-8 text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name={`educations.${index}.startDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Start Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value || ""}
                          className="h-8 text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`educations.${index}.endDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">End Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value || ""}
                          className="h-8 text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name={`educations.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value || ""}
                        rows={2}
                        className="text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addEducation}
            size="sm"
            className="w-full"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add Education
          </Button>
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

