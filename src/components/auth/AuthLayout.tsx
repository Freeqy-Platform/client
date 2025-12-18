import React from "react";
import { Link } from "react-router-dom";
import { Users, Quote } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import verify from "../../assets/imgs/auth/vertical-for-vrfiy.jpg";
import laptop from "../../assets/imgs/auth/laptop-for-register.jpg";

interface AuthLayoutProps {
  children: React.ReactNode;
  variant?: "register" | "login" | "forgot" | "reset" | "verify";
  leftContent?: React.ReactNode;
}

/**
 * Auth layout component with a left side for promotional content and a right side for the auth form
 */
export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  variant = "register",
  leftContent,
}) => {
  const defaultLeftContent = (
    <div className="relative h-full flex flex-col justify-between p-8 lg:p-12">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 z-10">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
          <Users className="h-6 w-6 text-white" />
        </div>
        <span className="text-2xl font-bold text-white">Freeqy</span>
      </Link>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6 z-10">
        {variant === "register" && (
          <>
            {/* Laptop Illustration Placeholder */}
            <div className="w-full max-w-md mb-4">
              <div className="relative bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
                <img
                  src={laptop}
                  alt="laptop"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>

            <h2 className="text-4xl font-bold text-white">
              Build your dream team today
            </h2>
            <p className="text-lg text-white/80 max-w-md">
              Join thousands of teams managing projects efficiently. Start your
              journey with Freeqy now and streamline your workflow.
            </p>

            {/* Social Proof */}
            <div className="flex items-center gap-3 mt-8">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <Avatar key={i} className="h-10 w-10 border-2 border-white">
                    <AvatarFallback className="bg-[var(--purple)] text-white text-xs">
                      {String.fromCharCode(64 + i)}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">+2k</p>
                <p className="text-white/70 text-sm">
                  Trusted by leading teams
                </p>
              </div>
            </div>
          </>
        )}

        {variant === "login" && (
          <>
            <h2 className="text-4xl font-bold text-white">Welcome back</h2>
            <p className="text-lg text-white/80 max-w-md">
              Enter your details to access your workspace and continue building
              amazing projects with your team.
            </p>

            {/* Testimonial */}
            <div className="mt-8 bg-black/40 backdrop-blur-sm rounded-lg p-6 max-w-md border border-white/10">
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="text-yellow-400 text-sm">
                    ★
                  </span>
                ))}
              </div>
              <Quote className="h-6 w-6 text-white/60 mb-2" />
              <p className="text-white text-sm italic mb-4">
                "Freeqy has completely transformed how our remote teams form and
                execute projects. It's seamless."
              </p>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-[var(--purple)] text-white">
                    AM
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white font-semibold text-sm">
                    Adham Khaled
                  </p>
                  <p className="text-white/70 text-xs">
                    Backend Developer at TiTans
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {(variant === "forgot" ||
          variant === "reset" ||
          variant === "verify") && (
          <>
            <h2 className="text-4xl font-bold text-white">
              {variant === "forgot"
                ? "Reset your password"
                : variant === "reset"
                ? "Create new password"
                : "Verify your email"}
            </h2>
            <p className="text-lg text-white/80 max-w-md">
              {variant === "forgot"
                ? "Enter your email address and we'll send you a link to reset your password."
                : variant === "reset"
                ? "Enter your new password below to secure your account."
                : "We've sent a verification code to your email. Please enter it below."}
            </p>
          </>
        )}
      </div>

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#9333ea] via-[#7c3aed] to-[#6366f1] opacity-90"></div>
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${verify})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Promotional */}
      <div className="hidden lg:flex  bg-gradient-to-br from-[#9333ea] via-[#7c3aed] to-[#6366f1] relative overflow-hidden">
        {leftContent || defaultLeftContent}
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};
