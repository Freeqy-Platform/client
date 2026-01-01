import React, { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Pencil, Trash2, Upload } from "lucide-react";
import type { User } from "../../types/user";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

interface BannerPhotoProps {
  user: User;
  bannerPreview?: string | null;
  onBannerUpload: (file: File) => void;
  onBannerDelete: () => void;
  isUploading?: boolean;
  isDeleting?: boolean;
}

export const BannerPhoto: React.FC<BannerPhotoProps> = ({
  user,
  bannerPreview,
  onBannerUpload,
  onBannerDelete,
  isUploading = false,
  isDeleting = false,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(bannerPreview || null);

  // Use preview if available, otherwise use user's banner photo (which updates reactively from React Query)
  const bannerUrl = bannerPreview || user.bannerPhotoUrl || null;
  const hasBanner = !!bannerUrl;

  // Update preview when bannerPreview prop changes
  useEffect(() => {
    if (bannerPreview) {
      setPreview(bannerPreview);
    } else if (!user.bannerPhotoUrl) {
      setPreview(null);
    } else {
      // Use user's banner photo from React Query cache
      setPreview(user.bannerPhotoUrl);
    }
  }, [bannerPreview, user.bannerPhotoUrl]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      onBannerUpload(file);
      setIsDialogOpen(false);
    }
  };

  const handleDelete = async () => {
    await onBannerDelete();
    setPreview(null);
    setIsDeleteDialogOpen(false);
    setIsDialogOpen(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <div className="relative w-full h-64 sm:h-72 overflow-hidden group">
        {/* Banner Image */}
        {bannerUrl ? (
          <img
            src={bannerUrl}
            alt="Banner"
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[var(--purple)] via-purple-600 to-purple-800" />
        )}

        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 hover:bg-background shadow-lg backdrop-blur-sm"
          onClick={() => setIsDialogOpen(true)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Banner Photo</DialogTitle>
            <DialogDescription>
              Upload a new banner photo or delete the current one.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Preview */}
            {preview && (
              <div className="relative w-full h-32 rounded-lg overflow-hidden border">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Upload Button */}
            <Button
              onClick={handleUploadClick}
              disabled={isUploading}
              className="w-full"
              variant="outline"
            >
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload New Banner Photo"}
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />

            {/* Delete Button */}
            {hasBanner && (
              <Button
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={isDeleting}
                variant="destructive"
                className="w-full"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isDeleting ? "Deleting..." : "Delete Banner Photo"}
              </Button>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Banner Photo</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your banner photo? This action
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
    </>
  );
};
