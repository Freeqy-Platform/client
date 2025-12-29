import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Link as LinkIcon, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { User, UpdateSocialLinksRequest, SocialLink } from "@/types/user";
import { SocialLinksEditor } from "@/components/profile/editors/SocialLinksEditor";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { socialLinksSchema } from "@/lib/validations/profileSchemas";
import {
  convertSocialLinksToArray,
  getSocialMediaIcon,
} from "@/lib/utils/profileUtils";

interface SocialLinksSectionProps {
  user: User;
  onUpdate: (data: UpdateSocialLinksRequest) => Promise<void>;
  isUpdating: boolean;
}

export const SocialLinksSection: React.FC<SocialLinksSectionProps> = ({
  user,
  onUpdate,
  isUpdating,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);

  const socialLinksArray = React.useMemo(
    () => convertSocialLinksToArray(user.socialLinks),
    [user.socialLinks]
  );

  const form = useForm<UpdateSocialLinksRequest>({
    resolver: zodResolver(socialLinksSchema),
    defaultValues: {
      socialLinks: socialLinksArray,
    },
  });

  React.useEffect(() => {
    form.reset({
      socialLinks: socialLinksArray,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socialLinksArray]);

  const onSubmit = async (data: UpdateSocialLinksRequest) => {
    try {
      await onUpdate(data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating social links:", error);
    }
  };

  return (
    <Card className="mt-4 border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            Social Links
          </CardTitle>
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8">
                <Edit className="h-3.5 w-3.5 mr-1.5" />
                {socialLinksArray.length > 0 ? "Edit" : "Add"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg overflow-y-auto max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="text-xl">Edit Social Links</DialogTitle>
                <DialogDescription className="text-sm">
                  Add your social media and professional links.
                </DialogDescription>
              </DialogHeader>
              <SocialLinksEditor
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
        {socialLinksArray.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {socialLinksArray.map((link: SocialLink, index: number) => {
              const IconComponent = getSocialMediaIcon(link.platform);
              return (
                <a
                  key={index}
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-sm font-medium text-foreground hover:text-[var(--purple)] transition-colors px-4 py-2.5 rounded-lg border border-border hover:border-[var(--purple)] hover:bg-muted/50"
                >
                  <IconComponent className="h-5 w-5 shrink-0" />
                  <span>{link.platform}</span>
                </a>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No social links added yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
