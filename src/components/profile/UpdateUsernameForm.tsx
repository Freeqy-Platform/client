import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUpdateUsername } from "@/hooks/user/userHooks";
import { setFormErrors } from "@/lib/form-error-handler";
import { User } from "lucide-react";

const usernameUpdateSchema = z.object({
  userName: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores, and hyphens"
    ),
});

type UsernameUpdateFormData = z.infer<typeof usernameUpdateSchema>;

interface UpdateUsernameFormProps {
  currentUsername?: string;
}

export const UpdateUsernameForm: React.FC<UpdateUsernameFormProps> = ({
  currentUsername,
}) => {
  const updateUsername = useUpdateUsername();

  const form = useForm<UsernameUpdateFormData>({
    resolver: zodResolver(usernameUpdateSchema),
    defaultValues: {
      userName: currentUsername || "",
    },
  });

  // Update form when currentUsername changes
  React.useEffect(() => {
    if (currentUsername) {
      form.reset({
        userName: currentUsername,
      });
    }
  }, [currentUsername, form]);

  const onSubmit = async (data: UsernameUpdateFormData) => {
    try {
      await updateUsername.mutateAsync({
        NewUsername: data.userName,
      });
      // Don't reset form - keep the new username visible
    } catch (error) {
      // Map API field name "NewUsername" to form field "userName"
      setFormErrors(error, form.setError, { NewUsername: "userName" });
      console.error("Error updating username:", error);
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <User className="h-5 w-5" />
          <CardTitle>Update Username</CardTitle>
        </div>
        <CardDescription>
          Change your username. This will be visible to other users.
          {currentUsername && (
            <span className="block mt-1 text-sm">
              Current username: <span className="font-medium">@{currentUsername}</span>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Username</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        @
                      </span>
                      <Input
                        type="text"
                        placeholder="Enter your new username"
                        className="pl-7"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground mt-1">
                    Username can only contain letters, numbers, underscores, and hyphens.
                  </p>
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {form.formState.errors.root.message}
              </div>
            )}

            <Button
              type="submit"
              disabled={updateUsername.isPending}
              className="w-full bg-[var(--purple)] text-[var(--purple-foreground)] hover:bg-[var(--purple)]/90"
            >
              {updateUsername.isPending ? "Updating..." : "Update Username"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

