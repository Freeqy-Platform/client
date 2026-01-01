import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type { Category, Technology } from "@/types/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { Pagination } from "@/components/ui/pagination";
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
import { ProjectStatus, ProjectVisibility, statusStringToNumber } from "@/types/projects";
import { useMe } from "@/hooks/user/userHooks";
import { usePaginatedProjects } from "@/hooks/projects/usePaginatedProjects";
import { projectService } from "@/services/projectService";

export default function ProjectsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: currentUser } = useMe();
  const [categories, setCategories] = useState<Category[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [createOpen, setCreateOpen] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Build filter object for paginated query
  const filter: {
    Category?: string;
    status?: number;
  } = {};

  // Backend supports Category (category name search)
  // Combine search and category filter - both use Category parameter
  const categoryFilter =
    selectedCategory && selectedCategory !== "all"
      ? selectedCategory
      : debouncedSearch;
  if (categoryFilter) filter.Category = categoryFilter;
  if (selectedStatus && selectedStatus !== "all") {
    filter.status = statusStringToNumber(selectedStatus as ProjectStatus);
  }

  // Use paginated projects hook
  const {
    projects,
    pageNumber,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    isLoading,
    isFetching,
    isPlaceholderData,
    goToPage,
    setPageSize,
    pageSize,
  } = usePaginatedProjects(filter);

  // Debug: Log pagination data
  useEffect(() => {
    if (projects.length > 0 || totalPages > 0) {
      console.log("Pagination Debug:", {
        projectsCount: projects.length,
        pageNumber,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      });
    }
  }, [projects.length, pageNumber, totalPages, hasNextPage, hasPreviousPage]);

  // Filter projects client-side for visibility (public/private)
  const visibleProjects = projects.filter((project) => {
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

  useEffect(() => {
    fetchMetadata();
  }, []);

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
      setCategories(cats || []);
      setTechnologies(techs || []);
    } catch (error) {
      console.error("Failed to fetch metadata", error);
    }
  };

  const handleProjectCreated = () => {
    // Reset to first page and refetch
    goToPage(1);
  };

  // Show loading state only on initial load, not when fetching cached pages
  const showLoading = isLoading && !isPlaceholderData;

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
            onChange={(e) => {
              setSearch(e.target.value);
              // Reset to page 1 when search changes
              goToPage(1);
            }}
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto flex-wrap">
          <Select
            value={selectedCategory}
            onValueChange={(value) => {
              setSelectedCategory(value);
              goToPage(1); // Reset to page 1 when filter changes
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

          <Select
            value={selectedStatus}
            onValueChange={(value) => {
              setSelectedStatus(value);
              goToPage(1); // Reset to page 1 when filter changes
            }}
          >
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

      {/* Loading State */}
      {showLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : visibleProjects.length === 0 ? (
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
        <>
          {/* Subtle loading indicator when fetching cached pages */}
          {isFetching && isPlaceholderData && (
            <div className="flex justify-center items-center py-2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={handleProjectCreated}
              />
            ))}
          </div>

          {/* Pagination - Always show if we have projects or pagination data */}
          {(visibleProjects.length > 0 || totalPages > 0) && (
            <div className="flex flex-col gap-4 pt-8 mt-8 border-t">
              {totalPages > 0 ? (
                <>
                  <Pagination
                    currentPage={pageNumber}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                    hasNextPage={hasNextPage}
                    hasPreviousPage={hasPreviousPage}
                    isLoading={isFetching}
                    pageSize={pageSize}
                    onPageSizeChange={setPageSize}
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    Page {pageNumber} of {totalPages}
                    {visibleProjects.length > 0 && (
                      <span className="ml-2">
                        • {visibleProjects.length} {visibleProjects.length === 1 ? "project" : "projects"} on this page
                      </span>
                    )}
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center">
                  Showing {visibleProjects.length} {visibleProjects.length === 1 ? "project" : "projects"}
                </p>
              )}
            </div>
          )}
        </>
      )}

      <CreateProjectDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={handleProjectCreated}
      />
    </div>
  );
}
