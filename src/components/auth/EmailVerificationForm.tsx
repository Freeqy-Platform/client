import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useAuth } from "../../hooks/auth/useAuth";
import { Mail, ArrowLeft } from "lucide-react";
import { setFormErrors } from "../../lib/form-error-handler";

const emailVerificationSchema = z.object({
  code: z.string().min(6, "Verification code must be at least 6 characters"),
});

type EmailVerificationFormData = z.infer<typeof emailVerificationSchema>;

export const EmailVerificationForm = () => {
  const [searchParams] = useSearchParams();
  const {
    confirmEmail,
    resendConfirmationCode,
    isConfirmEmailLoading,
    isResendConfirmationLoading,
  } = useAuth();

  const userId = searchParams.get("userId") || searchParams.get("id");
  const code = searchParams.get("code");
  const email = searchParams.get("email");

  const form = useForm<EmailVerificationFormData>({
    resolver: zodResolver(emailVerificationSchema),
    defaultValues: {
      code: code || "",
    },
  });

  const onSubmit = (data: EmailVerificationFormData) => {
    if (!userId) {
      form.setError("root", { message: "Invalid verification link" });
      return;
    }

    form.clearErrors();
    confirmEmail(
      {
        id: userId,
        code: data.code,
      },
      {
        onError: (error) => {
          setFormErrors(error, form.setError);
        },
      }
    );
  };

  // Auto-submit if both userId and code are provided in URL
  useEffect(() => {
    if (userId && code && code.length >= 6) {
      form.setValue("code", code);
      // Use setTimeout to ensure form state is updated
      setTimeout(() => {
        form.handleSubmit(onSubmit)();
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, code]);

  const handleResendCode = () => {
    if (!email) {
      form.setError("root", {
        message: "Email address is required to resend code",
      });
      return;
    }

    resendConfirmationCode({ email });
  };

  if (!userId) {
    return (
      <div className="w-full space-y-6">
        <div className="space-y-2 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--purple)]/10">
            <Mail className="h-6 w-6 text-[var(--purple)]" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Check your email</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            We've sent you a verification email. Please check your inbox and click the verification link to activate your account.
          </p>
        </div>

        <div className="space-y-3">
          <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
            <p className="font-medium mb-2">Didn't receive the email?</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Check your spam or junk folder</li>
              <li>Make sure you entered the correct email address</li>
              <li>Wait a few minutes for the email to arrive</li>
            </ul>
          </div>

          <Link to="/login" className="block">
            <Button
              variant="outline"
              className="w-full h-11 text-base font-semibold"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-foreground">
          Verify your email
        </h1>
        <p className="text-muted-foreground">
          {email ? (
            <>
              We've sent a verification code to <strong>{email}</strong>
            </>
          ) : code ? (
            "Please verify your email address"
          ) : (
            "Enter the verification code sent to your email"
          )}
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      className="pr-10 text-center text-2xl tracking-widest"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.formState.errors.root && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {form.formState.errors.root.message}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-[var(--purple)] text-[var(--purple-foreground)] hover:bg-[var(--purple)]/90 h-11 text-base font-semibold"
            disabled={isConfirmEmailLoading}
          >
            {isConfirmEmailLoading ? "Verifying..." : "Verify Email"}
          </Button>
        </form>
      </Form>

      {/* Resend Code */}
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Didn't receive the code?{" "}
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto text-[var(--purple)] font-semibold"
            onClick={handleResendCode}
            disabled={isResendConfirmationLoading}
          >
            {isResendConfirmationLoading ? "Sending..." : "Resend Code"}
          </Button>
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-[var(--purple)] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sign In
        </Link>
      </div>
    </div>
  );
};
