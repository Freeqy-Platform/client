import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Camera, X } from "lucide-react";
import type { User } from "../../types/user";
import { getUserInitials, getUserPhotoUrl } from "../../lib/utils/profileUtils";

interface ProfilePhotoProps {
  user: User;
  photoPreview?: string | null;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhotoDelete: () => void;
}

export const ProfilePhoto: React.FC<ProfilePhotoProps> = ({
  user,
  photoPreview,
  onPhotoUpload,
  onPhotoDelete,
}) => {
  const photoUrl = getUserPhotoUrl(user, photoPreview);
  const initials = getUserInitials(user);

  return (
    <div className="relative -mb-12">
      <div className="relative group">
        <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-background shadow-xl ring-4 ring-background/50">
          {photoUrl && (
            <AvatarImage
              src={photoUrl}
              alt={`${user.firstName} ${user.lastName}`}
              className="object-cover"
            />
          )}
          <AvatarFallback className="text-xl sm:text-2xl font-semibold bg-[var(--purple)] text-[var(--purple-foreground)]">
            {initials}
          </AvatarFallback>
        </Avatar>
        <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all cursor-pointer rounded-full backdrop-blur-sm">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPhotoUpload}
          />
          <Camera className="h-5 w-5 text-white" />
        </label>
      </div>
      {photoUrl && (
        <Button
          variant="destructive"
          size="icon"
          className="absolute -top-1 -right-1 h-6 w-6 rounded-full shadow-lg"
          onClick={onPhotoDelete}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

