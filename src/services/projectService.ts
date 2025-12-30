import { apiClient } from "@/lib/api-client";
import type {
    Project,
    ProjectRequest,
    ProjectFilter,
    Category,
    Technology,
    ChangeProjectStatusRequest,
    ProjectMember,
    UpdateMemberRoleRequest,
    ProjectVisibility // Kept to match imports, though might be unused here
} from "@/types/projects";

export const projectService = {
    // Projects
    getProjects: async (filter?: ProjectFilter) => {
        return apiClient.get<Project[]>("/Projects", { params: filter });
    },

    getProject: async (id: string) => {
        return apiClient.get<Project>(`/Projects/${id}`);
    },

    createProject: async (data: ProjectRequest) => {
        return apiClient.post<Project>("/Projects", data);
    },

    updateProject: async (id: string, data: ProjectRequest) => {
        return apiClient.put<Project>(`/Projects/${id}`, data);
    },

    deleteProject: async (id: string) => {
        return apiClient.delete(`/Projects/${id}`);
    },

    // Categories
    getCategories: async () => {
        return apiClient.get<Category[]>("/Projects/categories");
    },

    // Seeding helper for Categories
    createCategory: async (name: string) => {
        return apiClient.post<Category>("/Projects/categories", { name, description: name });
    },

    // Technologies
    getTechnologies: async () => {
        return apiClient.get<Technology[]>("/Projects/technologies");
    },

    // Seeding helper for Technologies
    createTechnology: async (name: string) => {
        return apiClient.post<Technology>("/Projects/technologies", { name });
    },

    // Members
    addMember: async (projectId: string, email: string) => {
        return apiClient.post<ProjectMember>(`/Projects/${projectId}/members`, { email });
    },

    removeMember: async (projectId: string, memberId: string) => {
        return apiClient.delete(`/Projects/${projectId}/members/${memberId}`);
    },

    updateMemberRole: async (projectId: string, memberId: string, role: string) => {
        return apiClient.put<void>(`/Projects/${projectId}/members/${memberId}/role`, { role } as UpdateMemberRoleRequest);
    },

    // Status
    updateStatus: async (projectId: string, status: number) => {
        return apiClient.put<void>(`/Projects/${projectId}/status`, { status } as ChangeProjectStatusRequest);
    }
};
