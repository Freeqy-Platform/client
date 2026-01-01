import React from "react";
import type { User } from "../../../types/user";

interface ReadOnlyBannerPhotoProps {
  user: User;
}

export const ReadOnlyBannerPhoto: React.FC<ReadOnlyBannerPhotoProps> = ({
  user,
}) => {
  const bannerUrl = user.bannerPhotoUrl || null;

  // Always render a container, even if no banner, to maintain layout
  return (
    <div className="w-full h-64 sm:h-72 rounded-lg overflow-hidden bg-muted">
      {bannerUrl ? (
        <img
          src={bannerUrl}
          alt={`${user.firstName} ${user.lastName}'s banner`}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-muted" />
      )}
    </div>
  );
};

