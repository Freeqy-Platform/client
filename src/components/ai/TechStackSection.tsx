import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Code,
  Monitor,
  Database,
  Brain,
  Cloud,
  Layers,
} from "lucide-react";
import type { TechStackResponse } from "@/types/aiAnalysis";

interface TechStackSectionProps {
  techStack: TechStackResponse;
}

const techCategoryConfig = {
  backend: {
    icon: Code,
    label: "Backend",
    color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  },
  frontend: {
    icon: Monitor,
    label: "Frontend",
    color: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  },
  database: {
    icon: Database,
    label: "Database",
    color: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  },
  ai_stack: {
    icon: Brain,
    label: "AI Stack",
    color: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
  },
  devops: {
    icon: Cloud,
    label: "DevOps",
    color: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20",
  },
} as const;

export function TechStackSection({ techStack }: TechStackSectionProps) {
  const categories = [
    { key: "backend" as const, items: techStack.backend },
    { key: "frontend" as const, items: techStack.frontend },
    { key: "database" as const, items: techStack.database },
    { key: "ai_stack" as const, items: techStack.ai_stack },
    { key: "devops" as const, items: techStack.devops },
  ].filter((category) => category.items.length > 0);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Layers className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Technology Stack</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => {
          const config = techCategoryConfig[category.key];
          const Icon = config.icon;

          return (
            <Card key={category.key} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${config.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{config.label}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((tech, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-sm font-normal"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

