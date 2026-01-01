import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { projectService } from "@/services/projectService";
import type { Project, Category, Technology } from "@/types/projects";
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
import { Plus, Search, Loader2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";
import { ProjectStatus, ProjectVisibility } from "@/types/projects";
import { useMe } from "@/hooks/user/userHooks";

export default function ProjectsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: currentUser } = useMe();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [createOpen, setCreateOpen] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [debouncedSearch, selectedCategory, selectedStatus]);

  // Check for create query parameter and open dialog
  useEffect(() => {
    const shouldCreate = searchParams.get("create") === "true";
    if (shouldCreate) {
      setCreateOpen(true);
      // Remove the query parameter from URL
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("create");
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const fetchMetadata = async () => {
    try {
      const [cats, techs] = await Promise.all([
        projectService.getCategories(),
        projectService.getTechnologies(),
      ]);
      // console.log("DEBUG: Categories loaded:", cats);
      // console.log("DEBUG: Technologies loaded:", techs);
      setCategories(cats || []);
      setTechnologies(techs || []);
    } catch (error) {
      console.error("Failed to fetch metadata", error);
    }
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const filter: any = {};

      // Backend supports Category (category name search)
      // Combine search and category filter - both use Category parameter
      const categoryFilter =
        selectedCategory && selectedCategory !== "all"
          ? selectedCategory
          : debouncedSearch;
      if (categoryFilter) filter.Category = categoryFilter;
      if (selectedStatus && selectedStatus !== "all")
        filter.status = selectedStatus;

      // Add timeout safeguard
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out")), 8000)
      );

      const response = await Promise.race([
        projectService.getProjects(filter),
        timeoutPromise,
      ]);

      // console.log("DEBUG: Raw Projects Response:", response); // Debugging line

      // Handle potential wrapped response (e.g. { projects: [...] }, PaginatedList or Result wrapper)
      // @ts-ignore - Safe handling of unknown structure
      const data = Array.isArray(response)
        ? response
        : response?.projects || response?.items || response?.value || [];

      if (!Array.isArray(data)) {
        console.error("Unexpected project data format:", response);
        setProjects([]);
      } else {
        // Filter out private projects that don't belong to current user
        const filteredProjects = data.filter((project) => {
          // Show public projects to everyone
          if (project.visibility === ProjectVisibility.Public) {
            return true;
          }
          // Show private projects only to their owner
          if (project.visibility === ProjectVisibility.Private) {
            return currentUser?.id === project.owner.id;
          }
          return false;
        });
        setProjects(filteredProjects);
      }
    } catch (error) {
      console.error("Failed to fetch projects", error);
      toast.error("Failed to load projects. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container px-6 mx-auto py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track your projects effectively.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/projects/analyze">
            <Button variant="outline" className="gap-2">
              <Sparkles className="h-4 w-4" />
              AI Analyzer
            </Button>
          </Link>
          <Button onClick={() => setCreateOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by category name..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto flex-wrap">
          <Select
            value={selectedCategory}
            onValueChange={(value) => {
              setSelectedCategory(value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-categories" disabled>
                  No categories available
                </SelectItem>
              )}
            </SelectContent>
          </Select>

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
      ) : projects.length === 0 ? (
        <div className="text-center py-12 border rounded-xl bg-muted/20 border-dashed">
          <h3 className="text-lg font-semibold">No projects found</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            Get started by creating your first project.
          </p>
          <Button onClick={() => setCreateOpen(true)} variant="outline">
            Create Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
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
