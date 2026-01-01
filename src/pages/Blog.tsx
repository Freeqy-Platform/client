import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  User,
  ArrowRight,
  Search,
  Tag,
  BookOpen,
} from "lucide-react";

const Blog = () => {
  const categories = [
    "All",
    "Product Updates",
    "Tutorials",
    "Best Practices",
    "Community",
    "Case Studies",
  ];

  const blogPosts = [
    {
      id: 1,
      title: "Introducing AI Project Analyzer: Build Better Teams with AI",
      excerpt:
        "Discover how our new AI-powered tool helps you find the perfect team structure and technology stack for your projects.",
      author: "Freeqy Team",
      date: "January 15, 2025",
      category: "Product Updates",
      readTime: "5 min read",
      featured: true,
    },
    {
      id: 2,
      title: "10 Tips for Successful Remote Team Collaboration",
      excerpt:
        "Learn proven strategies for managing distributed teams and ensuring effective communication across time zones.",
      author: "Sarah Johnson",
      date: "January 10, 2025",
      category: "Best Practices",
      readTime: "8 min read",
      featured: false,
    },
    {
      id: 3,
      title: "How to Build a Startup Team: A Complete Guide",
      excerpt:
        "From finding co-founders to hiring your first employees, learn how to assemble the right team for your startup journey.",
      author: "Michael Chen",
      date: "January 5, 2025",
      category: "Tutorials",
      readTime: "12 min read",
      featured: false,
    },
    {
      id: 4,
      title: "Case Study: How a 5-Person Team Built a SaaS Product in 3 Months",
      excerpt:
        "Read about how a small team used Freeqy to find collaborators and launch their product faster than expected.",
      author: "Emma Davis",
      date: "December 28, 2024",
      category: "Case Studies",
      readTime: "10 min read",
      featured: false,
    },
    {
      id: 5,
      title: "The Future of Project Management: AI and Collaboration",
      excerpt:
        "Explore how artificial intelligence is transforming the way teams work together and manage projects.",
      author: "Freeqy Team",
      date: "December 20, 2024",
      category: "Product Updates",
      readTime: "7 min read",
      featured: false,
    },
    {
      id: 6,
      title: "Building Your Developer Portfolio: Tips from Top Contributors",
      excerpt:
        "Learn how to showcase your skills effectively and attract the right project opportunities on Freeqy.",
      author: "Alex Rodriguez",
      date: "December 15, 2024",
      category: "Best Practices",
      readTime: "6 min read",
      featured: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest news, tutorials, and insights from the
            Freeqy community.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={category === "All" ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        {blogPosts.find((post) => post.featured) && (
          <Card className="mb-12 border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Badge className="mb-3">Featured</Badge>
                  <CardTitle className="text-3xl mb-4">
                    {blogPosts.find((post) => post.featured)?.title}
                  </CardTitle>
                  <p className="text-muted-foreground text-lg mb-4">
                    {blogPosts.find((post) => post.featured)?.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {blogPosts.find((post) => post.featured)?.author}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {blogPosts.find((post) => post.featured)?.date}
                    </div>
                    <Badge variant="secondary">
                      {blogPosts.find((post) => post.featured)?.category}
                    </Badge>
                    <span>{blogPosts.find((post) => post.featured)?.readTime}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button className="gap-2">
                Read Article
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts
            .filter((post) => !post.featured)
            .map((post) => (
              <Card
                key={post.id}
                className="hover:shadow-lg transition-shadow flex flex-col"
              >
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="secondary" className="text-xs">
                      {post.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mb-2 line-clamp-2">
                    {post.title}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {post.excerpt}
                  </p>
                </CardHeader>
                <CardContent className="mt-auto">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </div>
                    <span>{post.readTime}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full gap-2">
                    Read More
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Newsletter CTA */}
        <Card className="mt-12 bg-primary/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Subscribe to our newsletter to get the latest articles, product
              updates, and community news delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                placeholder="Enter your email"
                type="email"
                className="flex-1"
              />
              <Button>Subscribe</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Blog;
