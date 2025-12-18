import React from "react";
import { Link } from "react-router-dom";
import { Construction, ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";

interface UnderConstructionProps {
  /**
   * Optional custom title. Defaults to "Under Construction"
   */
  title?: string;
  /**
   * Optional custom description. Defaults to a generic message
   */
  description?: string;
  /**
   * Optional link to go back. If provided, shows a "Go Back" button
   */
  backLink?: string;
  /**
   * Optional callback for back button. If provided, shows a "Go Back" button
   */
  onBack?: () => void;
}

export const UnderConstruction: React.FC<UnderConstructionProps> = ({
  title = "Still Working On It",
  description = "We're working hard to bring you something amazing. This page is currently being built.",
  backLink,
  onBack,
}) => {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-[var(--purple)] to-[#7c3aed] p-4 rounded-full">
              <Construction className="h-12 w-12 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              {title}
            </CardTitle>
            <CardDescription className="text-base">
              {description}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {backLink && (
              <Button
                asChild
                variant="outline"
                className="border-[var(--purple)] text-[var(--purple)] hover:bg-[var(--purple)]/10"
              >
                <Link to={backLink} className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Go Back
                </Link>
              </Button>
            )}

            {onBack && !backLink && (
              <Button
                onClick={onBack}
                variant="outline"
                className="border-[var(--purple)] text-[var(--purple)] hover:bg-[var(--purple)]/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            )}

            <Button
              asChild
              className="bg-[var(--purple)] text-[var(--purple-foreground)] hover:bg-[var(--purple)]/90"
            >
              <Link to="/">Go to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
