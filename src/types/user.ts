// User Profile Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userName?: string;
  phoneNumber?: string;
  summary?: string;
  availability?: string;
  // URL to the user's profile photo returned from the backend
  photoUrl?: string | null;
  // Kept for backwards compatibility if other endpoints still use `photo`
  photo?: string | null;
  isEmailConfirmed?: boolean;
  skills?: Skill[];
  socialLinks?: SocialLinks;
  educations?: Education[];
  certificates?: Certificate[];
  track?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Skill {
  id?: string;
  name: string;
  level?: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  portfolio?: string;
  website?: string;
}

export interface Education {
  id?: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
}

export interface Certificate {
  id?: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

// Request DTOs
export interface UpdateUserProfileRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  summary?: string;
  availability?: string;
  track?: string;
}

export interface UpdateUserSkillsRequest {
  skills: Skill[];
}

export interface UpdateSocialLinksRequest {
  github?: string;
  linkedin?: string;
  twitter?: string;
  portfolio?: string;
  website?: string;
}

export interface UpdateEducationsRequest {
  educations: Education[];
}

export interface UpdateCertificatesRequest {
  certificates: Certificate[];
}

export interface UpdateUsernameRequest {
  userName: string;
}

export interface UpdatePhoneNumberRequest {
  phoneNumber: string;
}

export interface UpdateSummaryRequest {
  summary: string;
}

export interface UpdateAvailabilityRequest {
  availability: string;
}

export interface UpdateEmailRequest {
  email: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UsersListQueryParams {
  Name?: string;
  Track?: string;
  Skills?: string[]; // Array of skill names
  page?: number;
  pageSize?: number;
}

export interface UsersListResponse {
  users: User[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ConfirmEmailRequest {
  userId: string;
  token: string;
}

