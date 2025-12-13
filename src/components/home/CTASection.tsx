import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CTASectionProps {
  onStartProject?: () => void;
  onJoinTeam?: () => void;
}

export const CTASection = ({
  onStartProject,
  onJoinTeam,
}: CTASectionProps) => {
  const navigate = useNavigate();

  const handleStartProject = () => {
    if (onStartProject) {
      onStartProject();
    } else {
      navigate("/register");
    }
  };

  const handleJoinTeam = () => {
    if (onJoinTeam) {
      onJoinTeam();
    } else {
      navigate("/register");
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#9333ea] to-[#7c3aed] py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Ready to Build Something Amazing?
          </h2>
          <p className="mb-8 text-lg text-white/90 sm:text-xl">
            Join thousands of creators, developers, and innovators who are
            building the future together.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              onClick={handleStartProject}
              size="lg"
              variant="secondary"
              className="bg-white text-[var(--purple)] hover:bg-white/90 shadow-lg"
            >
              Start Your Project
            </Button>
            <Button
              onClick={handleJoinTeam}
              size="lg"
              className="bg-[var(--purple)] text-white hover:bg-[var(--purple)]/90 shadow-lg"
            >
              Join a Team
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

