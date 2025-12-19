import { apiClient } from "../lib/api-client";

export interface ConnectionRequest {
  receiverId: string;
  message?: string;
}

export interface ConnectionStatus {
  status: "none" | "pending" | "accepted" | "rejected";
  connectionId?: string;
}

export interface MessageRequest {
  receiverId: string;
  content: string;
}

/**
 * Connection Service
 * Handles connection requests and messaging
 */
export const connectionService = {
  /**
   * POST /api/Connections/request
   * Send a connection request
   */
  sendConnectionRequest: async (data: ConnectionRequest): Promise<void> => {
    await apiClient.post("/Connections/request", data);
  },

  /**
   * GET /api/Connections/status/{userId}
   * Get connection status with a user
   */
  getConnectionStatus: async (userId: string): Promise<ConnectionStatus> => {
    return apiClient.get<ConnectionStatus>(`/Connections/status/${userId}`);
  },

  /**
   * POST /api/Connections/{connectionId}/accept
   * Accept a connection request
   */
  acceptConnection: async (connectionId: string): Promise<void> => {
    await apiClient.post(`/Connections/${connectionId}/accept`);
  },

  /**
   * POST /api/Connections/{connectionId}/reject
   * Reject a connection request
   */
  rejectConnection: async (connectionId: string): Promise<void> => {
    await apiClient.post(`/Connections/${connectionId}/reject`);
  },

  /**
   * POST /api/Messages/send
   * Send a message to a user
   */
  sendMessage: async (data: MessageRequest): Promise<void> => {
    await apiClient.post("/Messages/send", data);
  },

  /**
   * GET /api/Users/{userId}/can-receive-messages
   * Check if user can receive public messages
   */
  canReceiveMessages: async (userId: string): Promise<boolean> => {
    const response = await apiClient.get<{ canReceiveMessages: boolean }>(
      `/Users/${userId}/can-receive-messages`
    );
    return response.canReceiveMessages;
  },
};

