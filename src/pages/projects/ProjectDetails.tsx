import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { projectService } from "@/services/projectService";
import {
  ProjectStatus,
  ProjectVisibility,
  ProjectStatusLabels,
  ProjectVisibilityLabels,
} from "@/types/projects";
import type { Project } from "@/types/projects";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { InviteMembersDialog } from "@/components/projects/InviteMembersDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Calendar,
  Users,
  Clock,
  Globe,
  Lock,
  ArrowLeft,
  Edit,
  Trash2,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { useMe } from "@/hooks/user/userHooks";

// Generate consistent random estimated months based on project ID
const getRandomEstimatedMonths = (projectId: string): string => {
  // Use project ID as seed for consistent random value
  let hash = 0;
  for (let i = 0; i < projectId.length; i++) {
    hash = projectId.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Generate number between 1-12 months
  const months = Math.abs(hash % 12) + 1;
  return `${months} ${months === 1 ? "month" : "months"}`;
};
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

export default function ProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { data: currentUser } = useMe();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwner = currentUser?.id === project?.owner.id;

  // Generate consistent random estimated months for demo
  const estimatedMonths = useMemo(
    () => (project ? getRandomEstimatedMonths(project.id) : ""),
    [project?.id]
  );

  useEffect(() => {
    if (projectId) {
      fetchProject(projectId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, currentUser?.id]);

  const fetchProject = async (id: string) => {
    try {
      setLoading(true);
      const data = await projectService.getProject(id);

      // Check if user has access to private project
      if (
        data.visibility === ProjectVisibility.Private &&
        currentUser?.id !== data.owner.id
      ) {
        toast.error("You don't have permission to view this project");
        navigate("/projects");
        return;
      }

      setProject(data);
    } catch (error) {
      console.error("Failed to fetch project", error);
      toast.error("Failed to load project details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Project not found</h2>
        <Button variant="link" onClick={() => navigate("/projects")}>
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      <Button
        variant="ghost"
        onClick={() => navigate("/projects")}
        className="gap-2 pl-0"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3 flex-wrap">
              <span className="break-words">{project.name}</span>
              <Badge
                variant={
                  project.status === ProjectStatus.InProgress
                    ? "default"
                    : "secondary"
                }
                className="flex-shrink-0"
              >
                {ProjectStatusLabels[project.status]}
              </Badge>
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                {project.visibility === ProjectVisibility.Public ? (
                  <Globe className="h-3 w-3" />
                ) : (
                  <Lock className="h-3 w-3" />
                )}
                {ProjectVisibilityLabels[project.visibility]}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Created {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        {isOwner && (
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={() => setInviteOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Members
            </Button>
            <Button onClick={() => setEditOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Project
            </Button>
            <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">About</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {project.description}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Technologies</h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <Badge key={tech.id} variant="secondary">
                  {tech.name}
                </Badge>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border bg-card text-card-foreground shadow p-6 space-y-4">
            <h3 className="font-semibold">Project Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Team Size
                </span>
                <span className="font-medium">
                  {project.membersCount} members
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Estimated Time
                </span>
                <span className="font-medium">{estimatedMonths}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">{project.category.name}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card text-card-foreground shadow p-6 space-y-4">
            <h3 className="font-semibold">Owner</h3>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                {project.owner.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-medium leading-none">{project.owner.name}</p>
                <p className="text-sm text-muted-foreground">Project Owner</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreateProjectDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={() => fetchProject(project.id)}
        projectToEdit={project}
      />

      <InviteMembersDialog
        projectId={project.id}
        projectName={project.name}
        open={inviteOpen}
        onOpenChange={setInviteOpen}
      />

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
              onClick={async () => {
                try {
                  setDeleting(true);
                  await projectService.deleteProject(project.id);
                  toast.success("Project deleted successfully");
                  navigate("/projects");
                } catch (error) {
                  console.error("Failed to delete project", error);
                  toast.error("Failed to delete project");
                } finally {
                  setDeleting(false);
                  setDeleteOpen(false);
                }
              }}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
