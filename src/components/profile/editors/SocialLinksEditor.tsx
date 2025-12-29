import React from "react";
import { Form } from "../../ui/form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Plus, X } from "lucide-react";
import { DialogFooter } from "../../ui/dialog";
import type { UseFormReturn } from "react-hook-form";
import type { UpdateSocialLinksRequest, SocialLink } from "../../../types/user";
import { POPULAR_SOCIAL_PLATFORMS } from "../../../lib/utils/profileUtils";

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
  const [customPlatforms, setCustomPlatforms] = React.useState<Record<number, string>>({});

  // Initialize custom platforms from existing links
  React.useEffect(() => {
    const customPlatformsMap: Record<number, string> = {};
    socialLinks.forEach((link, index) => {
      if (link?.platform && !POPULAR_SOCIAL_PLATFORMS.includes(link.platform as any)) {
        customPlatformsMap[index] = link.platform;
      }
    });
    if (Object.keys(customPlatformsMap).length > 0) {
      setCustomPlatforms(customPlatformsMap);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addSocialLink = () => {
    form.setValue("socialLinks", [...socialLinks, { platform: "", link: "" }]);
  };

  const removeSocialLink = (index: number) => {
    form.setValue(
      "socialLinks",
      socialLinks.filter((_, i) => i !== index)
    );
    // Remove custom platform for this index
    const newCustomPlatforms = { ...customPlatforms };
    delete newCustomPlatforms[index];
    setCustomPlatforms(newCustomPlatforms);
  };

  const handlePlatformChange = (index: number, value: string) => {
    const updatedLinks = [...socialLinks];
    if (value === "Other") {
      // Set platform to empty, we'll use customPlatforms state
      updatedLinks[index] = { ...updatedLinks[index], platform: "" };
      form.setValue("socialLinks", updatedLinks);
    } else {
      // Set platform to selected value and clear custom platform
      updatedLinks[index] = { ...updatedLinks[index], platform: value };
      form.setValue("socialLinks", updatedLinks);
      const newCustomPlatforms = { ...customPlatforms };
      delete newCustomPlatforms[index];
      setCustomPlatforms(newCustomPlatforms);
    }
  };

  const handleCustomPlatformChange = (index: number, value: string) => {
    setCustomPlatforms({ ...customPlatforms, [index]: value });
    const updatedLinks = [...socialLinks];
    updatedLinks[index] = { ...updatedLinks[index], platform: value };
    form.setValue("socialLinks", updatedLinks);
  };

  const getDisplayValue = (index: number) => {
    const link = socialLinks[index];
    if (!link?.platform) return "";
    // If platform is in the list, return it; otherwise it's a custom platform
    if (POPULAR_SOCIAL_PLATFORMS.includes(link.platform as any)) {
      return link.platform;
    }
    return "Other";
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
                render={({ field }) => {
                  const isOtherSelected = getDisplayValue(index) === "Other";
                  const customPlatformValue = customPlatforms[index] || socialLinks[index]?.platform || "";

                  return (
                    <FormItem>
                      <FormLabel className="text-xs">Platform *</FormLabel>
                      <Select
                        onValueChange={(value) => handlePlatformChange(index, value)}
                        value={getDisplayValue(index)}
                      >
                        <FormControl>
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {POPULAR_SOCIAL_PLATFORMS.map((platform) => (
                            <SelectItem key={platform} value={platform}>
                              {platform}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isOtherSelected && (
                        <Input
                          placeholder="Enter platform name"
                          value={customPlatformValue}
                          onChange={(e) => handleCustomPlatformChange(index, e.target.value)}
                          className="h-8 text-sm mt-2"
                        />
                      )}
                      <FormMessage />
                    </FormItem>
                  );
                }}
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

