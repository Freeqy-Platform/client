import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@/types/user";
import { getUserInitials, getUserPhotoUrl } from "@/lib/utils/profileUtils";

interface ReadOnlyProfilePhotoProps {
  user: User;
}

export const ReadOnlyProfilePhoto: React.FC<ReadOnlyProfilePhotoProps> = ({
  user,
}) => {
  const photoUrl = getUserPhotoUrl(user);
  const initials = getUserInitials(user);

  return (
    <div className="relative -mb-16">
      <Avatar className="h-32 w-32 sm:h-40 sm:w-40 border-2 border-background shadow-xl ring-2 ring-background/50">
        {photoUrl && (
          <AvatarImage
            src={photoUrl}
            alt={`${user.firstName} ${user.lastName}`}
            className="object-cover"
          />
        )}
        <AvatarFallback className="bg-[var(--purple)] text-[var(--purple-foreground)] text-2xl sm:text-3xl font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

