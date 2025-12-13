import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
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

  // Support both 'id' (old) and 'userId' (new) query params
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

    confirmEmail({
      id: userId,
      code: data.code,
    });
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
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-destructive">
            Invalid Link
          </CardTitle>
          <CardDescription className="text-center">
            This verification link is invalid or has expired.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link to="/auth/register" className="w-full">
            <Button className="w-full bg-[var(--purple)] text-[var(--purple-foreground)] hover:bg-[var(--purple)]/90">
              Register Again
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Verify Email
        </CardTitle>
        <CardDescription className="text-center">
          {email ? (
            <>
              We've sent a verification code to <strong>{email}</strong>
            </>
          ) : code ? (
            "Please verify your email address"
          ) : (
            "Enter the verification code sent to your email"
          )}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root && (
              <div className="text-sm text-destructive">
                {form.formState.errors.root.message}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 mt-4">
            <Button
              type="submit"
              className="w-full bg-[var(--purple)] text-[var(--purple-foreground)] hover:bg-[var(--purple)]/90"
              disabled={isConfirmEmailLoading}
            >
              {isConfirmEmailLoading ? "Verifying..." : "Verify Email"}
            </Button>
            <div className="text-center text-sm space-y-2">
              <div>
                Didn't receive the code?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-[var(--purple)]"
                  onClick={handleResendCode}
                  disabled={isResendConfirmationLoading}
                >
                  {isResendConfirmationLoading ? "Sending..." : "Resend Code"}
                </Button>
              </div>
              <div>
                <Link
                  to="/auth/login"
                  className="text-[var(--purple)] hover:underline"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
