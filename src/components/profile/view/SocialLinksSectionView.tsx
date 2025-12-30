import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Link as LinkIcon } from "lucide-react";
import type { User, SocialLink } from "../../../types/user";
import {
  convertSocialLinksToArray,
  getSocialMediaIcon,
} from "../../../lib/utils/profileUtils";

interface SocialLinksSectionViewProps {
  user: User;
}

export const SocialLinksSectionView: React.FC<SocialLinksSectionViewProps> = ({
  user,
}) => {
  const socialLinksArray = convertSocialLinksToArray(user.socialLinks);

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

