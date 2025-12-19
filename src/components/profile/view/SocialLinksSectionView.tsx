import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Link as LinkIcon } from "lucide-react";
import type { User, SocialLink } from "../../../types/user";
import { hasSocialLinksArray } from "../../../lib/utils/profileUtils";

interface SocialLinksSectionViewProps {
  user: User;
}

export const SocialLinksSectionView: React.FC<SocialLinksSectionViewProps> = ({
  user,
}) => {
  const socialLinksArray = hasSocialLinksArray(user.socialLinks)
    ? user.socialLinks.socialLinks
    : [];

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
            {socialLinksArray.map((link: SocialLink, index: number) => (
              <a
                key={index}
                href={link.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[var(--purple)] transition-colors px-2 py-1 rounded-md hover:bg-muted"
              >
                <LinkIcon className="h-3.5 w-3.5" />
                {link.platform}
              </a>
            ))}
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

