import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  UserPlus,
  Sparkles,
  FolderKanban,
  Users,
  MessageSquare,
  Rocket,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      icon: UserPlus,
      title: "Create Your Account",
      description:
        "Sign up for free and build your profile. Add your skills, education, experience, and showcase your work. The more complete your profile, the easier it is for others to find and connect with you.",
      features: [
        "Free account creation",
        "Customizable profile",
        "Skills and experience showcase",
        "Social links integration",
      ],
    },
    {
      number: 2,
      icon: Sparkles,
      title: "Analyze Your Project Idea",
      description:
        "Use our AI Project Analyzer to get intelligent recommendations for your project. Our AI will suggest the ideal team structure, required skills, and technology stack based on your project description.",
      features: [
        "AI-powered analysis",
        "Team structure recommendations",
        "Tech stack suggestions",
        "Skill requirements",
      ],
    },
    {
      number: 3,
      icon: FolderKanban,
      title: "Create Your Project",
      description:
        "Start a new project and set it up with all the details. Choose visibility settings, add technologies, set categories, and define your project goals. You can make it public to attract collaborators or keep it private.",
      features: [
        "Project creation wizard",
        "Public or private projects",
        "Technology tagging",
        "Category organization",
      ],
    },
    {
      number: 4,
      icon: Users,
      title: "Find Team Members",
      description:
        "Browse our community of talented individuals or use our discovery tools to find the perfect team members. Filter by skills, track, education, and more to find collaborators who match your project needs.",
      features: [
        "User discovery",
        "Advanced filtering",
        "Profile browsing",
        "Connection requests",
      ],
    },
    {
      number: 5,
      icon: MessageSquare,
      title: "Invite & Collaborate",
      description:
        "Send invitations to potential team members and start collaborating. Manage your team, assign roles, communicate through messages, and work together to bring your project to life.",
      features: [
        "Team invitations",
        "Role management",
        "In-app messaging",
        "Project collaboration",
      ],
    },
    {
      number: 6,
      icon: Rocket,
      title: "Launch & Grow",
      description:
        "With your team assembled and project set up, you're ready to build! Track progress, manage tasks, and celebrate milestones together. Freeqy provides all the tools you need for successful project execution.",
      features: [
        "Progress tracking",
        "Project management",
        "Team coordination",
        "Success metrics",
      ],
    },
  ];

  const benefits = [
    {
      title: "AI-Powered Insights",
      description:
        "Get intelligent recommendations for team composition and technology choices.",
    },
    {
      title: "Global Community",
      description:
        "Connect with talented individuals from around the world.",
    },
    {
      title: "Easy Collaboration",
      description:
        "Streamlined tools for team management and project coordination.",
    },
    {
      title: "Free to Start",
      description:
        "No upfront costs—start building your projects immediately.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              How Freeqy Works
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              From idea to execution—your complete guide to building successful
              projects with Freeqy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="gap-2">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Simple Steps to Success</h2>
              <p className="text-lg text-muted-foreground">
                Follow these six steps to turn your project idea into reality
              </p>
            </div>

            <div className="space-y-12">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isEven = index % 2 === 1;
                return (
                  <div
                    key={step.number}
                    className={`flex flex-col ${
                      isEven ? "md:flex-row-reverse" : "md:flex-row"
                    } gap-8 items-center`}
                  >
                    <div className="flex-1">
                      <Card className="h-full hover:shadow-lg transition-shadow">
                        <CardContent className="p-6 md:p-8">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl">
                              {step.number}
                            </div>
                            <div className="p-2 rounded-lg bg-primary/10">
                              <Icon className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold">{step.title}</h3>
                          </div>
                          <p className="text-muted-foreground mb-6 text-lg">
                            {step.description}
                          </p>
                          <div className="space-y-2">
                            {step.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                                <span className="text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="hidden md:flex flex-col items-center">
                        <div className="w-px h-16 bg-border"></div>
                        <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
                        <div className="w-px h-16 bg-border"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Freeqy?</h2>
              <p className="text-lg text-muted-foreground">
                Discover what makes Freeqy the perfect platform for your projects
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of creators who are already building amazing projects
              on Freeqy. It's free to start, and you can begin building your team
              today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="gap-2">
                  Create Free Account
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/projects/analyze">
                <Button size="lg" variant="outline" className="gap-2">
                  Try AI Analyzer
                  <Sparkles className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;

