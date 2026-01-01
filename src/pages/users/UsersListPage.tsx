import { useState, useMemo, useEffect } from "react";
import { useUsersList, useTracks, useMe } from "@/hooks/user/userHooks";
import type { UsersListQueryParams } from "@/types/user";
import { UserCard } from "@/components/users/UserCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";
import type { User } from "@/types/user";

const USERS_PER_PAGE = 12;

export default function UsersListPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [selectedTrack, setSelectedTrack] = useState<string>("all");
  const [selectedSkill, setSelectedSkill] = useState<string>("all");
  const [educationFilter, setEducationFilter] = useState("");
  const debouncedEducation = useDebounce(educationFilter, 500);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: tracks } = useTracks();
  const { data: currentUser } = useMe();

  // Build API filters (without pagination - we'll do client-side pagination)
  const apiFilters: UsersListQueryParams = useMemo(() => {
    const filters: UsersListQueryParams = {};
    
    if (debouncedSearch) {
      filters.Name = debouncedSearch;
    }
    
    if (selectedTrack && selectedTrack !== "all") {
      filters.Track = selectedTrack;
    }
    
    if (selectedSkill && selectedSkill !== "all") {
      filters.Skills = [selectedSkill];
    }
    
    return filters;
  }, [debouncedSearch, selectedTrack, selectedSkill]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedTrack, selectedSkill, debouncedEducation]);

  const { data: users, isLoading, error } = useUsersList(apiFilters);

  // Extract unique skills from users for filter dropdown
  const availableSkills = useMemo(() => {
    if (!users || !Array.isArray(users)) return [];
    const skillSet = new Set<string>();
    users.forEach((user) => {
      user.skills?.forEach((skill) => {
        if (skill.name) skillSet.add(skill.name);
      });
    });
    return Array.from(skillSet).sort();
  }, [users]);

  // Filter users client-side for education, exclude current user, and sort by createdAt
  const filteredAndSortedUsers = useMemo(() => {
    if (!users || !Array.isArray(users)) return [];

    let filtered = [...users];

    // Exclude current user
    if (currentUser?.id) {
      filtered = filtered.filter((user) => user.id !== currentUser.id);
    }

    // Client-side education filter
    if (debouncedEducation) {
      const educationLower = debouncedEducation.toLowerCase();
      filtered = filtered.filter((user) => {
        return user.educations?.some(
          (edu) =>
            edu.institution?.toLowerCase().includes(educationLower) ||
            edu.degree?.toLowerCase().includes(educationLower) ||
            edu.fieldOfStudy?.toLowerCase().includes(educationLower)
        );
      });
    }

    // Sort by createdAt (newest first)
    filtered.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA; // Descending order (newest first)
    });

    return filtered;
  }, [users, debouncedEducation, currentUser?.id]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedUsers.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const endIndex = startIndex + USERS_PER_PAGE;
  const paginatedUsers = filteredAndSortedUsers.slice(startIndex, endIndex);

  if (error) {
    toast.error("Failed to load users. Please try again.");
  }

  return (
    <div className="container px-6 sm:px-0 mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Discover Team Members & Collaborators
        </h1>
        <p className="text-muted-foreground mt-2">
          Find talented professionals to join your projects and build amazing
          things together.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto flex-wrap">
          <Select value={selectedTrack} onValueChange={setSelectedTrack}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Track" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tracks</SelectItem>
              {tracks?.map((track) => (
                <SelectItem key={track.id} value={track.name}>
                  {track.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSkill} onValueChange={setSelectedSkill}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Skill" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Skills</SelectItem>
              {availableSkills.map((skill) => (
                <SelectItem key={skill} value={skill}>
                  {skill}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Education (institution/degree)..."
            className="w-[200px]"
            value={educationFilter}
            onChange={(e) => setEducationFilter(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredAndSortedUsers.length === 0 ? (
        <div className="text-center py-12 border rounded-xl bg-muted/20 border-dashed">
          <h3 className="text-lg font-semibold">No users found</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            {search || selectedTrack !== "all" || selectedSkill !== "all" || educationFilter
              ? "No users match your filters. Try adjusting your search criteria."
              : "No users available at the moment."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginatedUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="min-w-[40px]"
                      >
                        {page}
                      </Button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="px-2">...</span>;
                  }
                  return null;
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

