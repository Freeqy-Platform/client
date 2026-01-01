import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  HelpCircle,
  Search,
  BookOpen,
  MessageCircle,
  UserPlus,
  FolderKanban,
  Users,
  Sparkles,
  Settings,
  Mail,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      icon: UserPlus,
      title: "Getting Started",
      color: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
      questions: [
        {
          q: "How do I create an account?",
          a: "Click the 'Sign Up' button in the top right corner, fill in your details (name, email, username, and password), and verify your email address. Once verified, you can start using Freeqy immediately.",
        },
        {
          q: "Is Freeqy free to use?",
          a: "Yes! Freeqy offers a free tier that includes core features like project creation, team collaboration, and AI analysis. Premium features may be available for advanced users in the future.",
        },
        {
          q: "What information do I need to provide?",
          a: "To get started, you'll need to provide your name, email address, username, and password. You can also add optional profile information like your skills, education, and social links to help others find you.",
        },
      ],
    },
    {
      icon: FolderKanban,
      title: "Projects",
      color: "bg-green-500/10 text-green-700 dark:text-green-400",
      questions: [
        {
          q: "How do I create a new project?",
          a: "Navigate to the Projects page and click the 'New Project' button. Fill in the project details including name, description, category, technologies, and visibility settings. You can also use our AI Analyzer to get recommendations first.",
        },
        {
          q: "What's the difference between Public and Private projects?",
          a: "Public projects are visible to all users and can be discovered by anyone. Private projects are only visible to you and team members you invite. Choose based on your project's needs.",
        },
        {
          q: "How do I invite team members to my project?",
          a: "Go to your project details page and click 'Invite Members'. You can search for users by name or username and send them an invitation. They'll receive a notification and can accept or decline.",
        },
        {
          q: "Can I edit or delete my project?",
          a: "Yes, project owners can edit project details at any time. You can also delete projects, but this action is permanent and cannot be undone. Only the project owner has these permissions.",
        },
      ],
    },
    {
      icon: Sparkles,
      title: "AI Analysis",
      color: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
      questions: [
        {
          q: "What is the AI Project Analyzer?",
          a: "Our AI Analyzer uses advanced machine learning to analyze your project idea and provide recommendations for team structure (roles, skills needed, team size) and technology stack (backend, frontend, database, etc.).",
        },
        {
          q: "How accurate are the AI recommendations?",
          a: "Our AI is trained on thousands of successful projects and continuously improves. While recommendations are highly accurate, they should be used as a starting point. You can always customize your team and tech stack based on your specific needs.",
        },
        {
          q: "Can I use AI analysis for existing projects?",
          a: "Yes! You can analyze any project idea, whether it's new or existing. The AI Analyzer can help you optimize your team structure or explore new technology options.",
        },
      ],
    },
    {
      icon: Users,
      title: "Team & Collaboration",
      color: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
      questions: [
        {
          q: "How do I find team members?",
          a: "Use the 'Discover Users' page to browse profiles, filter by track/specialization, skills, and education. You can view user profiles and send connection requests to potential collaborators.",
        },
        {
          q: "What are project invitations?",
          a: "Project invitations allow project owners to invite specific users to join their project. Invited users receive a notification and can accept or decline. You can manage invitations in the 'Invitations' section.",
        },
        {
          q: "How do I manage team member roles?",
          a: "Project owners can assign roles to team members and manage permissions. Go to your project details page and use the team management section to update roles and access levels.",
        },
      ],
    },
    {
      icon: Settings,
      title: "Account & Settings",
      color: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400",
      questions: [
        {
          q: "How do I update my profile?",
          a: "Go to your Profile page and click the edit icons next to any section. You can update your photo, banner, skills, education, certificates, social links, and more. Changes are saved automatically.",
        },
        {
          q: "How do I change my password?",
          a: "Navigate to Profile → Settings and use the 'Change Password' section. You'll need to enter your current password and choose a new secure password.",
        },
        {
          q: "How do I update my email address?",
          a: "Go to Profile → Settings and use the 'Update Email' section. You'll need to verify your new email address through a confirmation link sent to your new email.",
        },
        {
          q: "Can I delete my account?",
          a: "Yes, you can delete your account from the Settings page. This will permanently remove all your data, projects, and connections. This action cannot be undone.",
        },
      ],
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      color: "bg-red-500/10 text-red-700 dark:text-red-400",
      questions: [
        {
          q: "How is my data protected?",
          a: "We use industry-standard encryption, secure authentication, and regular security audits to protect your data. Your private projects and personal information are only accessible to you and authorized team members.",
        },
        {
          q: "Who can see my profile?",
          a: "Your profile is visible to all registered users, but you control what information is displayed. You can choose what to include in your public profile, such as skills, education, and social links.",
        },
        {
          q: "Can I make my profile private?",
          a: "Currently, profiles are visible to all registered users to facilitate collaboration. However, you can control what information appears on your profile and choose not to display certain details.",
        },
      ],
    },
  ];

  const filteredCategories = categories.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (q) =>
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.questions.length > 0);

  const quickLinks = [
    { label: "Contact Support", path: "/contact", icon: Mail },
    { label: "Privacy Policy", path: "/privacy", icon: Shield },
    { label: "Terms of Service", path: "/terms", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <HelpCircle className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">Help Center</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions and learn how to make the most of
            Freeqy.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for help articles..."
              className="pl-10 h-12 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <Link
                  key={index}
                  to={link.path}
                  className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category, categoryIndex) => {
              const Icon = category.icon;
              return (
                <Card key={categoryIndex}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${category.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-2xl">{category.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {category.questions.map((item, index) => (
                        <AccordionItem
                          key={index}
                          value={`${categoryIndex}-${index}`}
                        >
                          <AccordionTrigger className="text-left font-semibold">
                            {item.q}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">
                            {item.a}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-semibold mb-2">
                  No results found
                </p>
                <p className="text-muted-foreground">
                  Try searching with different keywords or{" "}
                  <Link to="/contact" className="text-primary hover:underline">
                    contact our support team
                  </Link>
                  .
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Contact Support CTA */}
        <Card className="mt-12 bg-primary/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Still need help?</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Can't find what you're looking for? Our support team is here to
              help you.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              Contact Support
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Help;
