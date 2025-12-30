import { ProjectStatus, ProjectStatusLabels, ProjectVisibilityLabels } from "@/types/projects";
import type { Project } from "@/types/projects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock, Users, Link as LinkIcon, Lock, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ProjectCardProps {
    project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
    const statusColors = {
        [ProjectStatus.Pending]: "bg-yellow-500",
        [ProjectStatus.InProgress]: "bg-blue-500",
        [ProjectStatus.Completed]: "bg-green-500",
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-xl font-bold truncate">
                        {project.name}
                    </CardTitle>
                    <Link to={`/projects/${project.id}`}>
                        <Button variant="outline" size="sm">
                            View
                        </Button>
                    </Link>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                    {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className={statusColors[project.status] + " text-white border-0"}>
                        {ProjectStatusLabels[project.status]}
                    </Badge>
                    <Badge variant="secondary">
                        {ProjectVisibilityLabels[project.visibility]}
                    </Badge>
                    <Badge variant="outline">
                        {project.category.name}
                    </Badge>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {project.membersCount}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {project.estimatedTime}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                    <span className="text-xs text-muted-foreground">Owner:</span>
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarFallback>{project.owner.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{project.owner.name}</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                    {project.technologies.slice(0, 3).map(Tech => (
                        <Badge key={Tech.id} variant="secondary" className="text-xs font-normal">
                            {Tech.name}
                        </Badge>
                    ))}
                    {project.technologies.length > 3 && (
                        <span className="text-xs text-muted-foreground">+{project.technologies.length - 3} more</span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
