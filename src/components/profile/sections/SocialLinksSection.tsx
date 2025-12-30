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

// Get platform-specific hover color
const getPlatformHoverColor = (platform: string): string => {
  const platformLower = platform.toLowerCase().trim();
  
  switch (platformLower) {
    case "linkedin":
      return "#0077b5"; // LinkedIn blue
    case "github":
      return "#181717"; // GitHub black
    case "x":
    case "twitter":
      return "#000000"; // X/Twitter black
    case "facebook":
      return "#1877F2"; // Facebook blue
    case "instagram":
      return "#E4405F"; // Instagram pink/red
    case "youtube":
      return "#FF0000"; // YouTube red
    case "tiktok":
      return "#000000"; // TikTok black
    case "discord":
      return "#5865F2"; // Discord blurple
    case "whatsapp":
      return "#25D366"; // WhatsApp green
    case "telegram":
      return "#0088cc"; // Telegram blue
    case "upwork":
      return "#6FDA44"; // Upwork green
    case "fiverr":
      return "#1DBF73"; // Fiverr green
    case "behance":
      return "#1769FF"; // Behance blue
    case "dribbble":
      return "#EA4C89"; // Dribbble pink
    case "medium":
      return "#000000"; // Medium black
    case "stack overflow":
    case "stackoverflow":
      return "#F48024"; // Stack Overflow orange
    default:
      return "var(--purple)"; // Default primary purple
  }
};

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
              const hoverColor = getPlatformHoverColor(link.platform);
              return (
                <a
                  key={index}
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-sm font-medium text-foreground transition-colors px-4 py-2.5 rounded-lg border border-border hover:bg-muted/50 group"
                  style={{
                    '--hover-color': hoverColor,
                  } as React.CSSProperties & { '--hover-color': string }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = hoverColor;
                    e.currentTarget.style.borderColor = hoverColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '';
                    e.currentTarget.style.borderColor = '';
                  }}
                >
                  <IconComponent className="h-5 w-5 shrink-0 transition-colors" />
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
