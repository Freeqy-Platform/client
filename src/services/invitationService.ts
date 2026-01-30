import { apiClient } from "@/lib/api-client";
import type {
    ProjectInvitation,
    MyInvitationsResponse,
    SendInvitationRequest,
    RespondInvitationRequest,
} from "@/types/invitation";

export const invitationService = {
    // Send invitation to a user for a specific project
    sendInvitation: async (
        projectId: string,
        data: SendInvitationRequest
    ): Promise<ProjectInvitation> => {
        return apiClient.post<ProjectInvitation>(
            `/ProjectInvitations/${projectId}/invitations`,
            data
        );
    },

    // Get all invitations for a specific project (sent by project owner)
    getProjectInvitations: async (
        projectId: string
    ): Promise<ProjectInvitation[]> => {
        const response = await apiClient.get<ProjectInvitation[] | MyInvitationsResponse>(
            `/ProjectInvitations/${projectId}/invitations`
        );

        // Handle both array and object response formats
        if (Array.isArray(response)) {
            return response;
        }

        // If it's the same format as getMyInvitations
        if (response && typeof response === 'object') {
            const pending = response.pendingInvitations || [];
            const responded = response.respondedInvitations || [];
            return [...pending, ...responded];
        }

        return [];
    },

    // Get all invitations received by the current user
    getMyInvitations: async (): Promise<MyInvitationsResponse> => {
        const response = await apiClient.get<MyInvitationsResponse>("/ProjectInvitations/invitations");
        return {
            pendingInvitations: response?.pendingInvitations || [],
            respondedInvitations: response?.respondedInvitations || [],
        };
    },

    // Get a specific invitation by ID
    getInvitation: async (invitationId: string): Promise<ProjectInvitation> => {
        return apiClient.get<ProjectInvitation>(
            `/ProjectInvitations/invitations/${invitationId}`
        );
    },

    // Cancel/Delete an invitation (by project owner)
    cancelInvitation: async (invitationId: string): Promise<void> => {
        return apiClient.delete<void>(
            `/ProjectInvitations/invitations/${invitationId}`
        );
    },

    // Respond to an invitation (accept or reject)
    respondToInvitation: async (
        data: RespondInvitationRequest
    ): Promise<void> => {
        return apiClient.post<void>("/ProjectInvitations/invitations/respond", data);
    },

    // Resend an invitation
    resendInvitation: async (invitationId: string): Promise<void> => {
        return apiClient.post<void>(
            `/ProjectInvitations/invitations/${invitationId}/resend`
        );
    },
};
