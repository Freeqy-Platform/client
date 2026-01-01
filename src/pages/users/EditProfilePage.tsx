import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useMe,
  useUpdateProfile,
  useUpdateSkills,
  useUpdateSocialLinks,
  useUpdateUsername,
  useUpdateEmail,
  useUpdatePassword,
  useUploadPhoto,
  useDeletePhoto,
} from "../hooks/user/userHooks";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Skeleton } from "../components/ui/skeleton";
import { User, X, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { setFormErrors } from "../lib/form-error-handler";
import type { Skill } from "../types/user";

// Form schemas
const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phoneNumber: z.string().optional(),
  summary: z.string().optional(),
  availability: z.string().optional(),
  track: z.string().optional(),
});

const usernameSchema = z.object({
  userName: z.string().min(3, "Username must be at least 3 characters"),
});

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type UsernameFormData = z.infer<typeof usernameSchema>;
type EmailFormData = z.infer<typeof emailSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

/**
 * EditProfilePage - Edit user profile with forms
 * Example usage of all update hooks
 */
const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { data: user, isLoading } = useMe();
  const updateProfile = useUpdateProfile();
  const updateSkills = useUpdateSkills();
  const updateSocialLinks = useUpdateSocialLinks();
  const updateUsername = useUpdateUsername();
  const updateEmail = useUpdateEmail();
  const updatePassword = useUpdatePassword();
  const uploadPhoto = useUploadPhoto();
  const deletePhoto = useDeletePhoto();

  // Profile form
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phoneNumber: user?.phoneNumber || "",
      summary: user?.summary || "",
      availability: user?.availability || "",
      track: user?.track || "",
    },
  });

  // Username form
  const usernameForm = useForm<UsernameFormData>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      userName: user?.userName || "",
    },
  });

  // Email form
  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: user?.email || "",
    },
  });

  // Password form
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Update form values when user data loads
  React.useEffect(() => {
    if (user) {
      profileForm.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phoneNumber || "",
        summary: user.summary || "",
        availability: user.availability || "",
        track: user.track || "",
      });
      usernameForm.reset({
        userName: user.userName || "",
      });
      emailForm.reset({
        email: user.email || "",
      });
    }
  }, [user, profileForm, usernameForm, emailForm]);

  // Photo upload
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    user?.photoUrl ?? (user?.photo ? String(user.photo) : null)
  );

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
      try {
        await uploadPhoto.mutateAsync(file);
      } catch (error) {
        setFormErrors(
          error,
          uploadPhoto.mutateAsync as (error: unknown) => void
        );
        console.error("Error uploading photo:", error);
      }
    }
  };

  const handleDeletePhoto = async () => {
    try {
      await deletePhoto.mutateAsync();
      setPhotoPreview(null);
    } catch (error) {
      // Error handled by hook
      console.error("Error deleting photo:", error);
    }
  };

  // Form handlers
  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile.mutateAsync(data);
    } catch (error) {
      setFormErrors(error, profileForm.setError);
    }
  };

  const onUsernameSubmit = async (data: UsernameFormData) => {
    try {
      await updateUsername.mutateAsync(data);
    } catch (error) {
      setFormErrors(error, usernameForm.setError);
    }
  };

  const onEmailSubmit = async (data: EmailFormData) => {
    try {
      await updateEmail.mutateAsync(data);
    } catch (error) {
      setFormErrors(error, emailForm.setError);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      await updatePassword.mutateAsync(data);
      passwordForm.reset();
    } catch (error) {
      setFormErrors(error, passwordForm.setError);
    }
  };

  // Skills management
  const [skills, setSkills] = useState<Skill[]>(user?.skills || []);

  React.useEffect(() => {
    if (user?.skills) {
      setSkills(user.skills);
    }
  }, [user]);

  const handleUpdateSkills = async () => {
    try {
      await updateSkills.mutateAsync({ skills });
    } catch (error) {
      setFormErrors(
        error,
        updateSkills.mutateAsync as (error: unknown) => void
      );
      console.error("Error updating skills:", error);
    }
  };

  // Social links
  const [socialLinks, setSocialLinks] = useState({
    github: user?.socialLinks?.github || "",
    linkedin: user?.socialLinks?.linkedin || "",
    twitter: user?.socialLinks?.twitter || "",
    portfolio: user?.socialLinks?.portfolio || "",
    website: user?.socialLinks?.website || "",
  });

  React.useEffect(() => {
    if (user?.socialLinks) {
      setSocialLinks({
        github: user.socialLinks.github || "",
        linkedin: user.socialLinks.linkedin || "",
        twitter: user.socialLinks.twitter || "",
        portfolio: user.socialLinks.portfolio || "",
        website: user.socialLinks.website || "",
      });
    }
  }, [user]);

  const handleUpdateSocialLinks = async () => {
    try {
      await updateSocialLinks.mutateAsync(socialLinks);
    } catch (error) {
      setFormErrors(
        error,
        updateSocialLinks.mutateAsync as (error: unknown) => void
      );
      console.error("Error updating social links:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Profile</h1>
        <Button variant="outline" onClick={() => navigate("/profile")}>
          Cancel
        </Button>
      </div>

      {/* Photo Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Photo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Profile"
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Label htmlFor="photo-upload" className="cursor-pointer">
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </span>
                </Button>
              </Label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
              {photoPreview && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeletePhoto}
                  disabled={deletePhoto.isPending}
                >
                  <X className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form
              onSubmit={profileForm.handleSubmit(onProfileSubmit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={profileForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={profileForm.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Summary</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Busy">Busy</SelectItem>
                        <SelectItem value="NotAvailable">Not Available</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={updateProfile.isPending}
                className="bg-[var(--purple)] text-[var(--purple-foreground)] hover:bg-[var(--purple)]/90"
              >
                {updateProfile.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Username */}
      <Card>
        <CardHeader>
          <CardTitle>Username</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...usernameForm}>
            <form
              onSubmit={usernameForm.handleSubmit(onUsernameSubmit)}
              className="space-y-4"
            >
              <FormField
                control={usernameForm.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={updateUsername.isPending}
                className="bg-[var(--purple)] text-[var(--purple-foreground)] hover:bg-[var(--purple)]/90"
              >
                {updateUsername.isPending ? "Updating..." : "Update Username"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Email */}
      <Card>
        <CardHeader>
          <CardTitle>Email</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(onEmailSubmit)}
              className="space-y-4"
            >
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={updateEmail.isPending}
                className="bg-[var(--purple)] text-[var(--purple-foreground)] hover:bg-[var(--purple)]/90"
              >
                {updateEmail.isPending ? "Updating..." : "Update Email"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="space-y-4"
            >
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={updatePassword.isPending}
                className="bg-[var(--purple)] text-[var(--purple-foreground)] hover:bg-[var(--purple)]/90"
              >
                {updatePassword.isPending ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>GitHub</Label>
            <Input
              value={socialLinks.github}
              onChange={(e) =>
                setSocialLinks({ ...socialLinks, github: e.target.value })
              }
              placeholder="https://github.com/username"
            />
          </div>
          <div>
            <Label>LinkedIn</Label>
            <Input
              value={socialLinks.linkedin}
              onChange={(e) =>
                setSocialLinks({ ...socialLinks, linkedin: e.target.value })
              }
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          <div>
            <Label>Website</Label>
            <Input
              value={socialLinks.website}
              onChange={(e) =>
                setSocialLinks({ ...socialLinks, website: e.target.value })
              }
              placeholder="https://yourwebsite.com"
            />
          </div>
          <Button
            onClick={handleUpdateSocialLinks}
            disabled={updateSocialLinks.isPending}
            className="bg-[var(--purple)] text-[var(--purple-foreground)] hover:bg-[var(--purple)]/90"
          >
            {updateSocialLinks.isPending ? "Saving..." : "Save Social Links"}
          </Button>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full"
              >
                <span>{skill.name}</span>
                <button
                  onClick={() =>
                    setSkills(skills.filter((_, i) => i !== index))
                  }
                  className="text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add skill"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const input = e.currentTarget;
                  if (input.value.trim()) {
                    setSkills([...skills, { name: input.value.trim() }]);
                    input.value = "";
                  }
                }
              }}
            />
          </div>
          <Button
            onClick={handleUpdateSkills}
            disabled={updateSkills.isPending}
            className="bg-[var(--purple)] text-[var(--purple-foreground)] hover:bg-[var(--purple)]/90"
          >
            {updateSkills.isPending ? "Saving..." : "Save Skills"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProfilePage;
