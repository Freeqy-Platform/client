import {
  ProjectStatus,
  ProjectStatusLabels,
  ProjectVisibilityLabels,
} from "@/types/projects";
import type { Project } from "@/types/projects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock, Users, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useMe } from "@/hooks/user/userHooks";
import { projectService } from "@/services/projectService";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface ProjectCardProps {
  project: Project;
  onDelete?: () => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const { data: currentUser } = useMe();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const isOwner = currentUser?.id === project.owner.id;

  const statusColors = {
    [ProjectStatus.Pending]: "bg-yellow-500",
    [ProjectStatus.InProgress]: "bg-blue-500",
    [ProjectStatus.Completed]: "bg-green-500",
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await projectService.deleteProject(project.id);
      toast.success("Project deleted successfully");
      onDelete?.();
    } catch (error) {
      console.error("Failed to delete project", error);
      toast.error("Failed to delete project");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow w-full max-w-full overflow-hidden">
      <CardHeader className="pb-3 min-w-0 w-full">
        <div className="flex justify-between items-start gap-4 w-full min-w-0">
          <CardTitle className="text-xl font-bold flex-1 min-w-0 pr-2">
            <span className="truncate block">{project.name}</span>
          </CardTitle>
          <div className="flex gap-2 flex-shrink-0">
            {isOwner && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDeleteOpen(true);
                }}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Link to={`/projects/${project.id}`}>
              <Button variant="outline" size="sm">
                View
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className={statusColors[project.status] + " text-white border-0"}
          >
            {ProjectStatusLabels[project.status]}
          </Badge>
          <Badge variant="secondary">
            {ProjectVisibilityLabels[project.visibility]}
          </Badge>
          <Badge variant="outline">{project.category.name}</Badge>
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
          <Link
            to={`/users/${project.owner.id}`}
            className="flex items-center gap-2"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-[var(--purple)] text-[var(--purple-foreground)]">
                {project.owner.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-md font-medium">{project.owner.name}</span>
          </Link>
        </div>

        <div className="flex flex-wrap gap-1 mt-2">
          {project.technologies.slice(0, 3).map((Tech) => (
            <Badge
              key={Tech.id}
              variant="secondary"
              className="text-xs font-normal"
            >
              {Tech.name}
            </Badge>
          ))}
          {project.technologies.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{project.technologies.length - 3} more
            </span>
          )}
        </div>
      </CardContent>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{project.name}"? This action
              cannot be undone and will permanently remove the project and all
              its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
