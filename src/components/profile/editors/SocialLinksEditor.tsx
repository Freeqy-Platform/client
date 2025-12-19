import React from "react";
import { Form } from "../../ui/form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../ui/form";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Plus, X } from "lucide-react";
import { DialogFooter } from "../../ui/dialog";
import type { UseFormReturn } from "react-hook-form";
import type { UpdateSocialLinksRequest, SocialLink } from "../../../types/user";

interface SocialLinksEditorProps {
  form: UseFormReturn<UpdateSocialLinksRequest>;
  onSubmit: (data: UpdateSocialLinksRequest) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const SocialLinksEditor: React.FC<SocialLinksEditorProps> = ({
  form,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const socialLinks = form.watch("socialLinks") || [];

  const addSocialLink = () => {
    form.setValue("socialLinks", [...socialLinks, { platform: "", link: "" }]);
  };

  const removeSocialLink = (index: number) => {
    form.setValue(
      "socialLinks",
      socialLinks.filter((_, i) => i !== index)
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <div className="space-y-3">
          {socialLinks.map((link: SocialLink, index: number) => (
            <div
              key={index}
              className="border rounded-lg p-3 space-y-2.5 bg-muted/30"
            >
              <div className="flex justify-between items-center pb-2 border-b">
                <h4 className="font-semibold text-sm">Link #{index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSocialLink(index)}
                  className="h-7 w-7 p-0"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
              <FormField
                control={form.control}
                name={`socialLinks.${index}.platform`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Platform *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., LinkedIn, GitHub"
                        className="h-8 text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`socialLinks.${index}.link`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">URL *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="https://..."
                        className="h-8 text-sm"
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
            onClick={addSocialLink}
            size="sm"
            className="w-full"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add Social Link
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

