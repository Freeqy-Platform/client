import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Link as LinkIcon } from "lucide-react";
import type { User, SocialLink } from "../../../types/user";
import {
  convertSocialLinksToArray,
  getSocialMediaIcon,
} from "../../../lib/utils/profileUtils";

// Get platform-specific hover color
const getPlatformHoverColor = (platform: string): string => {
  const platformLower = platform.toLowerCase().trim();

  switch (platformLower) {
    case "linkedin":
      return "#0077b5";
    case "github":
      return "#181717";
    case "x":
    case "twitter":
      return "#000000";
    case "facebook":
      return "#1877F2";
    case "instagram":
      return "#E4405F";
    case "youtube":
      return "#FF0000";
    case "tiktok":
      return "#000000";
    case "discord":
      return "#5865F2";
    case "whatsapp":
      return "#25D366";
    case "telegram":
      return "#0088cc";
    case "upwork":
      return "#6FDA44";
    case "fiverr":
      return "#1DBF73";
    case "behance":
      return "#1769FF";
    case "dribbble":
      return "#EA4C89";
    case "medium":
      return "#000000";
    case "stack overflow":
    case "stackoverflow":
      return "#F48024";
    default:
      return "var(--purple)";
  }
};

interface ReadOnlySocialLinksSectionProps {
  user: User;
}

export const ReadOnlySocialLinksSection: React.FC<
  ReadOnlySocialLinksSectionProps
> = ({ user }) => {
  const socialLinksArray = React.useMemo(
    () => convertSocialLinksToArray(user.socialLinks),
    [user.socialLinks]
  );

  return (
    <Card className="mt-4 border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <LinkIcon className="h-4 w-4" />
          Social Links
        </CardTitle>
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
                  className="inline-flex items-center gap-2.5 text-sm font-medium text-foreground transition-colors px-4 py-2.5 rounded-lg border border-border hover:bg-muted/50"
                  style={
                    {
                      "--hover-color": hoverColor,
                    } as React.CSSProperties & { "--hover-color": string }
                  }
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = hoverColor;
                    e.currentTarget.style.borderColor = hoverColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "";
                    e.currentTarget.style.borderColor = "";
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

