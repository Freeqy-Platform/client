import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  Users,
  Lightbulb,
  Heart,
  Rocket,
  Code,
  Globe,
  Award,
} from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Users,
      title: "Collaboration First",
      description:
        "We believe that the best projects are built by diverse teams working together. Our platform connects talented individuals to create something extraordinary.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "We're constantly pushing boundaries, using AI and cutting-edge technology to help teams work smarter and more efficiently.",
    },
    {
      icon: Heart,
      title: "Community",
      description:
        "Freeqy is more than a platform—it's a community of creators, innovators, and dreamers who support each other's growth.",
    },
    {
      icon: Rocket,
      title: "Empowerment",
      description:
        "We empower individuals to turn their ideas into reality by providing the tools, connections, and support they need to succeed.",
    },
  ];

  const stats = [
    { label: "Active Users", value: "10K+", icon: Users },
    { label: "Projects Created", value: "5K+", icon: Code },
    { label: "Countries", value: "50+", icon: Globe },
    { label: "Success Rate", value: "95%", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              About Freeqy
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Building the future of team collaboration, one project at a time.
            </p>
            <p className="text-lg text-muted-foreground">
              Freeqy is a revolutionary platform that connects talented
              individuals, facilitates project collaboration, and empowers teams
              to bring their ideas to life. We combine cutting-edge AI technology
              with a vibrant community to create the ultimate project management
              and team-building experience.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-3xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4 mb-8">
              <div className="p-3 rounded-lg bg-primary/10">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To democratize project collaboration by making it easy for anyone,
                  anywhere, to find the right team members, access AI-powered
                  insights, and build successful projects. We believe that great
                  ideas deserve great teams, and we're here to make that connection
                  happen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                These core values guide everything we do and shape how we build
                Freeqy for our community.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            {value.title}
                          </h3>
                          <p className="text-muted-foreground">
                            {value.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Story</h2>
            <div className="space-y-6 text-muted-foreground">
              <p className="text-lg leading-relaxed">
                Freeqy was born from a simple observation: great projects require
                great teams, but finding the right collaborators is often the
                hardest part. We saw talented developers, designers, and creators
                struggling to connect with like-minded individuals who shared their
                vision and passion.
              </p>
              <p className="text-lg leading-relaxed">
                In 2024, we set out to solve this problem by creating a platform
                that not only connects people but also provides intelligent
                recommendations for team composition and technology stacks. Our
                AI-powered analysis helps project creators understand exactly what
                they need to succeed.
              </p>
              <p className="text-lg leading-relaxed">
                Today, Freeqy has grown into a thriving community of thousands of
                users across the globe, working together on projects that range
                from innovative startups to open-source contributions. We're
                constantly evolving, adding new features, and improving the
                platform based on feedback from our amazing community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary/5 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Join the Freeqy Community</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Ready to turn your ideas into reality? Join thousands of creators
              who are already building amazing projects on Freeqy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                Get Started Free
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-background border border-border rounded-md font-medium hover:bg-muted transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
