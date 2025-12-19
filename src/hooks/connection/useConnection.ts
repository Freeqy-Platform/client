import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { connectionService } from "../../services/connectionService";
import { extractErrorMessage } from "../../lib/authApi";
import type {
  ConnectionRequest,
  MessageRequest,
} from "../../services/connectionService";

/**
 * GET /api/Connections/status/{userId}
 * Get connection status with a user
 */
export const useConnectionStatus = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["connection", "status", userId],
    queryFn: () => connectionService.getConnectionStatus(userId!),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

/**
 * POST /api/Connections/request
 * Send a connection request
 */
export const useSendConnectionRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ConnectionRequest) =>
      connectionService.sendConnectionRequest(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["connection", "status", variables.receiverId],
      });
      toast.success("Connection request sent successfully");
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message || "Failed to send connection request");
    },
  });
};

/**
 * POST /api/Connections/{connectionId}/accept
 * Accept a connection request
 */
export const useAcceptConnection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (connectionId: string) =>
      connectionService.acceptConnection(connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["connection"],
      });
      toast.success("Connection request accepted");
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message || "Failed to accept connection request");
    },
  });
};

/**
 * POST /api/Connections/{connectionId}/reject
 * Reject a connection request
 */
export const useRejectConnection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (connectionId: string) =>
      connectionService.rejectConnection(connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["connection"],
      });
      toast.success("Connection request rejected");
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message || "Failed to reject connection request");
    },
  });
};

/**
 * POST /api/Messages/send
 * Send a message to a user
 */
export const useSendMessage = () => {
  return useMutation({
    mutationFn: (data: MessageRequest) => connectionService.sendMessage(data),
    onSuccess: () => {
      toast.success("Message sent successfully");
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message || "Failed to send message");
    },
  });
};

/**
 * GET /api/Users/{userId}/can-receive-messages
 * Check if user can receive public messages
 */
export const useCanReceiveMessages = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["user", "can-receive-messages", userId],
    queryFn: () => connectionService.canReceiveMessages(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

