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

// Backend request format (uses numbers for status and visibility)
export interface ProjectRequest {
  name: string;
  description: string;
  status: number; // 0: Pending, 1: InProgress, 2: Completed
  visibility: number; // 0: Public, 1: Private
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
  Pending: "Pending",
  InProgress: "InProgress",
  Completed: "Completed",
} as const;

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];

export const ProjectStatusLabels: Record<ProjectStatus, string> = {
  [ProjectStatus.Pending]: "Pending",
  [ProjectStatus.InProgress]: "In Progress",
  [ProjectStatus.Completed]: "Completed",
};

// Backend numeric values for ProjectStatus
export const ProjectStatusNumeric = {
  Pending: 0,
  InProgress: 1,
  Completed: 2,
} as const;

// Conversion utilities: String enum <-> Number
export const statusStringToNumber = (status: ProjectStatus): number => {
  switch (status) {
    case ProjectStatus.Pending:
      return ProjectStatusNumeric.Pending;
    case ProjectStatus.InProgress:
      return ProjectStatusNumeric.InProgress;
    case ProjectStatus.Completed:
      return ProjectStatusNumeric.Completed;
    default:
      return ProjectStatusNumeric.Pending;
  }
};

export const statusNumberToString = (status: number): ProjectStatus => {
  switch (status) {
    case ProjectStatusNumeric.Pending:
      return ProjectStatus.Pending;
    case ProjectStatusNumeric.InProgress:
      return ProjectStatus.InProgress;
    case ProjectStatusNumeric.Completed:
      return ProjectStatus.Completed;
    default:
      return ProjectStatus.Pending;
  }
};

export const ProjectVisibility = {
  Public: "Public",
  Private: "Private",
} as const;

export type ProjectVisibility =
  (typeof ProjectVisibility)[keyof typeof ProjectVisibility];

export const ProjectVisibilityLabels: Record<ProjectVisibility, string> = {
  [ProjectVisibility.Public]: "Public",
  [ProjectVisibility.Private]: "Private",
};

// Backend numeric values for ProjectVisibility
export const ProjectVisibilityNumeric = {
  Public: 0,
  Private: 1,
} as const;

// Conversion utilities: String enum <-> Number
export const visibilityStringToNumber = (
  visibility: ProjectVisibility
): number => {
  switch (visibility) {
    case ProjectVisibility.Public:
      return ProjectVisibilityNumeric.Public;
    case ProjectVisibility.Private:
      return ProjectVisibilityNumeric.Private;
    default:
      return ProjectVisibilityNumeric.Private;
  }
};

export const visibilityNumberToString = (
  visibility: number
): ProjectVisibility => {
  switch (visibility) {
    case ProjectVisibilityNumeric.Public:
      return ProjectVisibility.Public;
    case ProjectVisibilityNumeric.Private:
      return ProjectVisibility.Private;
    default:
      return ProjectVisibility.Private;
  }
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
