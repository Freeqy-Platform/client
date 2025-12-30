import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Camera, Trash2 } from "lucide-react";
import type { User } from "../../types/user";
import { getUserInitials, getUserPhotoUrl } from "../../lib/utils/profileUtils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

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
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onPhotoDelete();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative -mb-16">
      <div className="relative group">
        <Avatar className="h-32 w-32 sm:h-40 sm:w-40 border-2 border-background shadow-xl ring-2 ring-background/50">
          {photoUrl && (
            <AvatarImage
              src={photoUrl}
              alt={`${user.firstName} ${user.lastName}`}
              className="object-cover"
            />
          )}
          <AvatarFallback className="text-2xl sm:text-3xl font-semibold bg-[var(--purple)] text-[var(--purple-foreground)]">
            {initials}
          </AvatarFallback>
        </Avatar>
        <label className="absolute w-32 h-32 sm:w-40 sm:h-40 inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all cursor-pointer rounded-full backdrop-blur-xs">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPhotoUpload}
          />
          <Camera className="h-6 w-6 text-white" />
        </label>
      </div>
      {photoUrl && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-background border-2 border-border shadow-lg hover:bg-destructive hover:border-destructive transition-all duration-200 flex items-center justify-center group/delete"
              aria-label="Delete profile photo"
            >
              <Trash2 className="h-4 w-4 text-muted-foreground group-hover/delete:text-destructive-foreground transition-colors" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Profile Image</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete your profile image? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};
