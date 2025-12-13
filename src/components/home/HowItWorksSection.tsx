import { StepCard } from "./StepCard";

export const HowItWorksSection = () => {
  const steps = [
    {
      stepNumber: 1,
      title: "Create Your Profile",
      description:
        "Showcase your skills, interests, and project preferences to attract the right teammates.",
      circleColor: "#9333ea", // Purple
    },
    {
      stepNumber: 2,
      title: "Find or Post Projects",
      description:
        "Browse existing projects or create your own. Our matching system will connect you with ideal collaborators.",
      circleColor: "#6366f1", // Blue-purple gradient (using indigo)
    },
    {
      stepNumber: 3,
      title: "Build & Collaborate",
      description:
        "Use our project management tools to organize tasks, track progress, and bring your ideas to life.",
      circleColor: "#14b8a6", // Teal-green
    },
  ];

  return (
    <section className="py-16 bg-background sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            How Freeqy Works
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
            Get started in just three simple steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid gap-8 sm:grid-cols-3 sm:gap-6 lg:gap-12">
          {steps.map((step) => (
            <StepCard
              key={step.stepNumber}
              stepNumber={step.stepNumber}
              title={step.title}
              description={step.description}
              circleColor={step.circleColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

