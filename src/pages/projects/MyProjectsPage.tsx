import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type { Project } from "@/types/projects";
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
import { Plus, Search, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { ProjectStatus, statusStringToNumber } from "@/types/projects";
import { useMe } from "@/hooks/user/userHooks";
import { usePaginatedProjects } from "@/hooks/projects/usePaginatedProjects";

export default function MyProjectsPage() {
  const { data: currentUser, isLoading: userLoading } = useMe();
  const [createOpen, setCreateOpen] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Build filter object - note: backend filtering by owner happens server-side
  // We'll filter client-side for owner match as fallback
  const filter: {
    status?: number;
  } = {};

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
      console.log("My Projects Pagination Debug:", {
        projectsCount: projects.length,
        pageNumber,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      });
    }
  }, [projects.length, pageNumber, totalPages, hasNextPage, hasPreviousPage]);

  // Filter to only show projects owned by current user
  // Note: Ideally this should be done server-side, but we filter client-side as fallback
  const myProjects = currentUser?.id
    ? projects.filter((project) => project.owner.id === currentUser.id)
    : [];

  // Client-side filtering for search (since backend may not support it)
  const filteredProjects = myProjects.filter((project) => {
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      return (
        project.name.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const handleProjectCreated = () => {
    // Reset to first page and refetch
    goToPage(1);
  };

  // Show loading state only on initial load, not when fetching cached pages
  const showLoading = (isLoading || userLoading) && !isPlaceholderData;

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
            onChange={(e) => {
              setSearch(e.target.value);
              // Note: Search is client-side, so we don't reset pagination
            }}
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto flex-wrap">
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
      ) : filteredProjects.length === 0 ? (
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
        <>
          {/* Subtle loading indicator when fetching cached pages */}
          {isFetching && isPlaceholderData && (
            <div className="flex justify-center items-center py-2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={handleProjectCreated}
              />
            ))}
          </div>

          {/* Pagination - Always show if we have projects or pagination data */}
          {(filteredProjects.length > 0 || totalPages > 0) && (
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
                    {filteredProjects.length > 0 && (
                      <span className="ml-2">
                        • {filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"} on this page
                      </span>
                    )}
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center">
                  Showing {filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"}
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
