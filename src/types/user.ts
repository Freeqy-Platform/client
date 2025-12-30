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
  photoUrl?: string | null;
  bannerPhotoUrl?: string | null;
  isEmailConfirmed?: boolean;
  skills?: Skill[];
  socialLinks?: SocialLinks | { socialLinks?: SocialLink[] } | SocialLink[];
  educations?: Education[];
  certificates?: Certificate[];
  track?: string;
  role?: "user" | "admin";
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
  X?: string;
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
  track?: string;
  FirstName?: string;
  LastName?: string;
  firstName?: string; // Keep for backwards compatibility
  lastName?: string; // Keep for backwards compatibility
  phoneNumber?: string;
  summary?: string;
  availability?: string;
}

export interface UpdateUserSkillsRequest {
  skills: string[]; // Array of skill names as strings
}

export interface SocialLink {
  platform: string;
  link: string;
}

export interface UpdateSocialLinksRequest {
  socialLinks: SocialLink[];
}

export interface EducationRequest {
  institutionName: string; // Required field
  degree?: string | null;
  fieldOfStudy?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  grade?: string | null;
  description?: string | null;
}

export interface UpdateEducationsRequest {
  educations: EducationRequest[];
}

export interface CertificateRequest {
  certificateName: string; // Required field
  issuer?: string | null;
  issueDate?: string | null;
  expirationDate?: string | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
  description?: string | null;
}

export interface UpdateCertificatesRequest {
  certificates: CertificateRequest[];
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
  newEmail: string;
  currentPassword: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface UsersListQueryParams {
  Name?: string;
  Track?: string;
  Skills?: string[]; // Array of skill names
  page?: number;
  pageSize?: number;
}

// Users list can return an array directly or wrapped in a response object
export type UsersListResponse = User[];

export interface ConfirmEmailRequest {
  userId: string;
  token: string;
}

// Track Types
export interface Track {
  id: number;
  name: string;
}

export interface TrackRequest {
  id: number;
  trackName: string;
  status: "Pending" | "Approved" | "Rejected";
  rejectionReason?: string;
  requestedAt: string;
  processedAt?: string;
  requestedBy?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface TrackRequestStats {
  requestsUsedThisMonth: number;
  nextRequestAllowedAt?: string;
  dailyLimitExceeded: boolean;
}

export interface UpdateTrackRequest {
  trackName: string;
}

export interface UpdateTrackWithConfirmRequest {
  proposedTrackName: string;
  confirmCreate: boolean;
}

export interface CreateTrackRequestDto {
  trackName: string;
}

export interface ApproveTrackRequestDto {
  requestId: number;
  createNewTrack: boolean;
  mergeIntoTrackId?: number;
}

export interface RejectTrackRequestDto {
  requestId: number;
  rejectionReason: string;
}