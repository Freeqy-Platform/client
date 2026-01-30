// Invitation Status Enum
export const InvitationStatus = {
    Pending: "Pending",
    Accepted: "Accepted",
    Rejected: "Rejected",
    Expired: "Expired",
} as const;

export type InvitationStatus =
    (typeof InvitationStatus)[keyof typeof InvitationStatus];

export const InvitationStatusLabels: Record<InvitationStatus, string> = {
    [InvitationStatus.Pending]: "Pending",
    [InvitationStatus.Accepted]: "Accepted",
    [InvitationStatus.Rejected]: "Rejected",
    [InvitationStatus.Expired]: "Expired",
};

// Invitation Interface - matches API response
export interface ProjectInvitation {
    inviteId: string;
    projectId: string;
    projectName: string;
    sentByName: string;
    invitedUserId: string;
    invitedEmail: string;
    status: InvitationStatus;
    respondedAt: string | null;
    createdAt: string;
    expiresAt: string;
}

// API Response for getting my invitations
export interface MyInvitationsResponse {
    pendingInvitations: ProjectInvitation[];
    respondedInvitations: ProjectInvitation[];
}

// Request to send an invitation
export interface SendInvitationRequest {
    email: string;
}

// Request to respond to an invitation
export interface RespondInvitationRequest {
    invitationId: string;
    accept: boolean;
    rejectionReason?: string;
}
