import { Button } from "@/components/ui/button";
import { FeatureList } from "./FeatureList";
import { StatCard } from "./StatCard";
import { Users } from "lucide-react";

interface HeroSectionProps {
  onGetStarted?: () => void;
  onBrowseProjects?: () => void;
}

export const HeroSection = ({
  onGetStarted,
  onBrowseProjects,
}: HeroSectionProps) => {
  const features = [
    { text: "Free to join" },
    { text: "Verified profiles" },
    { text: "Project management tools" },
  ];

  return (
    <section className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-background">
      <div className="container mx-auto px-4 py-12 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 lg:items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-6 lg:gap-8">
            <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Find Your Perfect{" "}
              <span className="text-[var(--purple)]">Team</span> for Any Project
            </h1>

            <p className="text-lg text-muted-foreground sm:text-xl">
              Connect with talented individuals for startup ideas, freelance
              projects, side hustles, and university assignments. Build amazing
              things together.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                onClick={onGetStarted}
                size="lg"
                className="bg-[var(--purple)] text-[var(--purple-foreground)] hover:bg-[var(--purple)]/90"
              >
                Start Building Teams
              </Button>
              <Button
                onClick={onBrowseProjects}
                variant="outline"
                size="lg"
                className="border-2 border-[var(--purple)] text-[var(--purple)] hover:bg-[var(--purple)]/10"
              >
                Browse Projects
              </Button>
            </div>

            {/* Feature List */}
            <FeatureList features={features} className="mt-2" />
          </div>

          {/* Right Image Area */}
          <div className="relative">
            {/* Placeholder for team image */}
            <div className="relative h-[400px] w-full overflow-hidden rounded-lg bg-gradient-to-br from-muted to-muted/50 sm:h-[500px] lg:h-[600px]">
              {/* This would be replaced with an actual image */}
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <Users className="mx-auto h-24 w-24 text-muted-foreground/30" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Team collaboration image
                  </p>
                </div>
              </div>

              {/* Overlay Statistic Card */}
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
                <StatCard value="1,247 Teams Formed" label="This month" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

