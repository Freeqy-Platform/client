import { useState, useEffect } from "react";
import { projectService } from "@/services/projectService";
import type { Project } from "@/types/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";
import { ProjectStatus } from "@/types/projects";
import { useMe } from "@/hooks/user/userHooks";

export default function MyProjectsPage() {
  const { data: currentUser, isLoading: userLoading } = useMe();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    if (currentUser?.id) {
      fetchProjects();
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (projects.length > 0) {
      filterProjects();
    }
  }, [debouncedSearch, selectedStatus, projects]);

  const fetchProjects = async () => {
    if (!currentUser?.id) return;

    try {
      setLoading(true);

      // Add timeout safeguard
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out")), 8000)
      );

      const response = await Promise.race([
        projectService.getProjects(),
        timeoutPromise,
      ]);

      // Handle potential wrapped response
      // @ts-ignore - Safe handling of unknown structure
      const data = Array.isArray(response)
        ? response
        : response?.projects || response?.items || response?.value || [];

      if (!Array.isArray(data)) {
        console.error("Unexpected project data format:", response);
        setProjects([]);
      } else {
        // Filter to only show projects owned by current user
        const myProjects = data.filter(
          (project) => project.owner.id === currentUser.id
        );
        setProjects(myProjects);
      }
    } catch (error) {
      console.error("Failed to fetch projects", error);
      toast.error("Failed to load projects. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = [...projects];

    // Filter by search term (project name or description)
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(searchLower) ||
          project.description.toLowerCase().includes(searchLower)
      );
    }

    // Filter by status
    if (selectedStatus && selectedStatus !== "all") {
      filtered = filtered.filter(
        (project) => project.status === selectedStatus
      );
    }

    setFilteredProjects(filtered);
  };

  if (userLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const displayProjects =
    filteredProjects.length > 0 ? filteredProjects : projects;

  return (
    <div className="container px-6 mx-auto py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your projects effectively.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto flex-wrap">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value={ProjectStatus.Pending}>Pending</SelectItem>
              <SelectItem value={ProjectStatus.InProgress}>
                In Progress
              </SelectItem>
              <SelectItem value={ProjectStatus.Completed}>Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : displayProjects.length === 0 ? (
        <div className="text-center py-12 border rounded-xl bg-muted/20 border-dashed">
          <h3 className="text-lg font-semibold">No projects found</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            {search || selectedStatus !== "all"
              ? "No projects match your filters. Try adjusting your search."
              : "Get started by creating your first project."}
          </p>
          <Button onClick={() => setCreateOpen(true)} variant="outline">
            Create Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={fetchProjects}
            />
          ))}
        </div>
      )}

      <CreateProjectDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={fetchProjects}
      />
    </div>
  );
}
