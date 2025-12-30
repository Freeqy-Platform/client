export interface Project {
    id: string;
    name: string;
    description: string;
    owner: {
        id: string;
        name: string;
    };
    category: {
        id: string;
        name: string;
    };
    status: ProjectStatus;
    visibility: ProjectVisibility;
    estimatedTime: string;
    technologies: Technology[];
    membersCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface Technology {
    id: string;
    name: string;
}

export interface Category {
    id: string;
    name: string;
    description?: string;
}

export interface ProjectRequest {
    name: string;
    description: string;
    status: ProjectStatus;
    visibility: ProjectVisibility;
    technologyIds: string[];
    estimatedTime: string; // Format: "d.hh:mm:ss" or similar, backend uses TimeSpan
    categoryId: string;
}

export interface ProjectFilter {
    search?: string;
    categoryId?: string;
    status?: ProjectStatus;
    visibility?: ProjectVisibility;
    technologyId?: string;
    pageNumber?: number;
    pageSize?: number;
}

export const ProjectStatus = {
    Pending: 0,
    InProgress: 1,
    Completed: 2
} as const;

export type ProjectStatus = typeof ProjectStatus[keyof typeof ProjectStatus];

export const ProjectStatusLabels: Record<ProjectStatus, string> = {
    [ProjectStatus.Pending]: "Pending",
    [ProjectStatus.InProgress]: "In Progress",
    [ProjectStatus.Completed]: "Completed"
};

export const ProjectVisibility = {
    Public: 0,
    Private: 1
} as const;

export type ProjectVisibility = typeof ProjectVisibility[keyof typeof ProjectVisibility];

export const ProjectVisibilityLabels: Record<ProjectVisibility, string> = {
    [ProjectVisibility.Public]: "Public",
    [ProjectVisibility.Private]: "Private"
};


export interface ProjectMember {
    id: string;
    userId: string;
    name: string;
    email: string;
    role: string;
    joinedAt: string;
}

export interface ChangeProjectStatusRequest {
    status: ProjectStatus;
}

export interface UpdateMemberRoleRequest {
    role: string;
}
