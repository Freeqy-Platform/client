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
import { useUpdateEmail } from "@/hooks/user/userHooks";
import { Mail, Lock } from "lucide-react";

const emailUpdateSchema = z.object({
  newEmail: z.string().email("Please enter a valid email address"),
  currentPassword: z.string().min(1, "Current password is required"),
});

type EmailUpdateFormData = z.infer<typeof emailUpdateSchema>;

interface UpdateEmailFormProps {
  currentEmail?: string;
}

export const UpdateEmailForm: React.FC<UpdateEmailFormProps> = ({
  currentEmail,
}) => {
  const updateEmail = useUpdateEmail();

  const form = useForm<EmailUpdateFormData>({
    resolver: zodResolver(emailUpdateSchema),
    defaultValues: {
      newEmail: "",
      currentPassword: "",
    },
  });

  const onSubmit = async (data: EmailUpdateFormData) => {
    try {
      await updateEmail.mutateAsync({
        newEmail: data.newEmail,
        currentPassword: data.currentPassword,
      });
      form.reset();
    } catch (error) {
      // Error is handled by the hook
      console.error("Error updating email:", error);
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          <CardTitle>Update Email</CardTitle>
        </div>
        <CardDescription>
          Change your email address. You'll need to verify the new email.
          {currentEmail && (
            <span className="block mt-1 text-sm">
              Current email: <span className="font-medium">{currentEmail}</span>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="newEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your new email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="Enter your current password"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={updateEmail.isPending}
              className="w-full bg-[var(--purple)] text-[var(--purple-foreground)] hover:bg-[var(--purple)]/90"
            >
              {updateEmail.isPending ? "Updating..." : "Update Email"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

