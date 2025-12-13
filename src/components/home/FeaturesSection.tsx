import {
  Search,
  Workflow,
  ShieldCheck,
  MessageCircle,
  TrendingUp,
  Globe,
} from "lucide-react";
import { FeatureCard } from "./FeatureCard";

export const FeaturesSection = () => {
  const features = [
    {
      icon: Search,
      title: "Smart Matching",
      description:
        "Our AI-powered algorithm matches you with teammates based on skills, interests, and project requirements.",
      iconBgColor: "#9333ea",
      iconColor: "#ffffff",
      cardBgColor: "#f3e8ff",
    },
    {
      icon: Workflow,
      title: "Project Management",
      description:
        "Built-in tools for task management, timeline tracking, and team communication to keep projects on track.",
      iconBgColor: "#9333ea",
      iconColor: "#ffffff",
      cardBgColor: "#ede9fe",
    },
    {
      icon: ShieldCheck,
      title: "Verified Profiles",
      description:
        "All team members go through verification process to ensure authentic and reliable collaborations.",
      iconBgColor: "#14b8a6",
      iconColor: "#ffffff",
      cardBgColor: "#ccfbf1",
    },
    {
      icon: MessageCircle,
      title: "Real-time Chat",
      description:
        "Instant messaging, video calls, and file sharing to keep your team connected and productive.",
      iconBgColor: "#10b981",
      iconColor: "#ffffff",
      cardBgColor: "#d1fae5",
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description:
        "Monitor project milestones, track contributions, and celebrate achievements with your team.",
      iconBgColor: "#f97316",
      iconColor: "#ffffff",
      cardBgColor: "#fed7aa",
    },
    {
      icon: Globe,
      title: "Global Network",
      description:
        "Connect with talented individuals from around the world and build diverse, innovative teams.",
      iconBgColor: "#3b82f6",
      iconColor: "#ffffff",
      cardBgColor: "#dbeafe",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-16 bg-background sm:py-20 lg:py-24"
    >
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Everything You Need to Build Great Teams
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
            From finding the right teammates to managing projects efficiently,
            Freeqy provides all the tools you need for successful collaboration.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              iconBgColor={feature.iconBgColor}
              iconColor={feature.iconColor}
              cardBgColor={feature.cardBgColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

