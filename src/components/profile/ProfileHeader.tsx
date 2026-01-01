import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Mail, Phone, Calendar, MapPin, CheckCircle2, Edit, Loader2 } from "lucide-react";
import {
  getAvailabilityColor,
  getAvailabilityLabel,
  availabilityStatusToString,
  availabilityStringToStatus,
} from "../../lib/utils/availabilityUtils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Form } from "../ui/form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "../../lib/validations/profileSchemas";
import type { User, UpdateUserProfileRequest } from "../../types/user";
import { TrackSelector } from "./TrackSelector";

interface ProfileHeaderProps {
  user: User;
  onUpdate: (data: UpdateUserProfileRequest) => Promise<void>;
  isUpdating: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  onUpdate,
  isUpdating,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);

  const form = useForm<UpdateUserProfileRequest>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phoneNumber: user.phoneNumber || "",
      availability: availabilityStatusToString(user.availability),
      trackName: user.track || "",
    },
  });

  // Update form when user data changes (reactively from React Query)
  React.useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phoneNumber || "",
        availability: availabilityStatusToString(user.availability),
        trackName: user.track || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.firstName, user?.lastName, user?.phoneNumber, user?.availability, user?.track]);

  const onSubmit = async (data: UpdateUserProfileRequest) => {
    try {
      await onUpdate(data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Card className="mt-12 border-0 shadow-md">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {user.firstName} {user.lastName}
            </h1>
            {user.userName && (
              <p className="text-sm text-muted-foreground">@{user.userName}</p>
            )}
            {user.track && (
              <div className="flex items-center gap-1.5 mt-1.5">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                <Badge variant="secondary" className="text-xs font-normal">
                  {user.track}
                </Badge>
              </div>
            )}
          </div>
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <Edit className="h-3.5 w-3.5 mr-1.5" />
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl">Edit Profile</DialogTitle>
                <DialogDescription className="text-sm">
                  Update your profile information.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">First Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9" placeholder="+1234567890" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="availability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Availability</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value || undefined);
                          }}
                          value={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select availability" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">Available</SelectItem>
                            <SelectItem value="2">Busy</SelectItem>
                            <SelectItem value="3">Do Not Disturb</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="trackName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Track</FormLabel>
                        <FormControl>
                          <TrackSelector
                            value={field.value || ""}
                            onChange={(trackName) => {
                              field.onChange(trackName);
                            }}
                            onCancel={() => {
                              form.resetField("trackName");
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      size="sm"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isUpdating} size="sm">
                      {isUpdating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {user.email && (
            <div className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="truncate">{user.email}</span>
              {user.isEmailConfirmed && (
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
              )}
            </div>
          )}
          {user.phoneNumber && (
            <div className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span>{user.phoneNumber}</span>
            </div>
          )}
          {user.availability && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <Badge
                variant="outline"
                className={`text-xs font-normal ${getAvailabilityColor(user.availability)}`}
              >
                {getAvailabilityLabel(user.availability)}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

