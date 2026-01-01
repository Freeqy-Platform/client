import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, Mail, Loader2 } from "lucide-react";
import { useConfirmEmail, useResendConfirmEmail } from "@/hooks/user/userHooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const resendEmailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const ConfirmEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const confirmEmail = useConfirmEmail();
  const resendEmail = useResendConfirmEmail();
  const [showEmailInput, setShowEmailInput] = useState(false);

  const userId = searchParams.get("userId");
  const token = searchParams.get("token");

  const resendForm = useForm<{ email: string }>({
    resolver: zodResolver(resendEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    // Only attempt confirmation if we have both userId and token
    if (
      userId &&
      token &&
      !confirmEmail.isSuccess &&
      !confirmEmail.isError &&
      !confirmEmail.isPending
    ) {
      confirmEmail.mutate({ userId, token });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, token]);

  // Redirect on success
  useEffect(() => {
    if (confirmEmail.isSuccess) {
      const timer = setTimeout(() => {
        navigate("/projects");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [confirmEmail.isSuccess, navigate]);

  // Show loading state while confirming
  if (confirmEmail.isPending) {
    return (
      <div className="min-h-[calc(100vh-4rem-4.5rem)] bg-muted/30 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto w-full">
          <Card className="w-full max-w-md mx-auto border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Loader2 className="h-12 w-12 text-[var(--purple)] animate-spin" />
              </div>
              <CardTitle className="text-2xl">Confirming Email</CardTitle>
              <CardDescription>
                Please wait while we verify your email address...
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  // Show success state
  if (confirmEmail.isSuccess) {
    return (
      <div className="min-h-[calc(100vh-4rem-4.5rem)] bg-muted/30 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto w-full">
          <Card className="w-full max-w-md mx-auto border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
                  <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <CardTitle className="text-2xl text-green-600 dark:text-green-400">
                Email Confirmed!
              </CardTitle>
              <CardDescription>
                Your email has been successfully confirmed. Redirecting you to
                projects...
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  // Show error state
  if (confirmEmail.isError || !userId || !token) {
    return (
      <div className="min-h-[calc(100vh-4rem-4.5rem)] bg-muted/30 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto w-full">
          <Card className="w-full max-w-md mx-auto border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3">
                  <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <CardTitle className="text-2xl text-red-600 dark:text-red-400">
                Confirmation Failed
              </CardTitle>
              <CardDescription>
                {!userId || !token
                  ? "Invalid confirmation link. Please check your email and try again."
                  : "We couldn't confirm your email. The link may have expired or is invalid."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showEmailInput ? (
                <Button
                  onClick={() => setShowEmailInput(true)}
                  className="w-full bg-[var(--purple)] text-[var(--purple-foreground)] hover:bg-[var(--purple)]/90"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Resend Confirmation Email
                </Button>
              ) : (
                <form
                  onSubmit={resendForm.handleSubmit((data) => {
                    resendEmail.mutate(
                      {
                        email: data.email,
                        ...(userId && { userId }),
                      },
                      {
                        onSuccess: () => {
                          setShowEmailInput(false);
                          resendForm.reset();
                        },
                      }
                    );
                  })}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      {...resendForm.register("email")}
                      disabled={resendEmail.isPending}
                    />
                    {resendForm.formState.errors.email && (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {resendForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      disabled={resendEmail.isPending}
                      className="flex-1 bg-[var(--purple)] text-[var(--purple-foreground)] hover:bg-[var(--purple)]/90"
                    >
                      {resendEmail.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" />
                          Send
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowEmailInput(false);
                        resendForm.reset();
                      }}
                      disabled={resendEmail.isPending}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
              <Button
                variant="outline"
                onClick={() => navigate("/profile/settings")}
                className="w-full"
              >
                Back to Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};

export default ConfirmEmailPage;
