import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  useAllTrackRequests,
  useApproveTrackRequest,
  useRejectTrackRequest,
  useTracks,
} from "../../hooks/user/userHooks";
import { Skeleton } from "../ui/skeleton";
import { Clock, CheckCircle2, XCircle, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import type { TrackRequest } from "../../types/user";

export const AdminTrackRequestsTable: React.FC = () => {
  const { data: requests, isLoading } = useAllTrackRequests();
  const { data: tracks } = useTracks();
  const approveRequest = useApproveTrackRequest();
  const rejectRequest = useRejectTrackRequest();

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<TrackRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [approveAction, setApproveAction] = useState<"create" | "merge">("create");
  const [mergeTrackId, setMergeTrackId] = useState<number | undefined>();

  const handleRejectClick = (request: TrackRequest) => {
    setSelectedRequest(request);
    setRejectionReason("");
    setRejectDialogOpen(true);
  };

  const handleApproveClick = (request: TrackRequest) => {
    setSelectedRequest(request);
    setApproveAction("create");
    setMergeTrackId(undefined);
    setApproveDialogOpen(true);
  };

  const handleRejectSubmit = async () => {
    if (!selectedRequest || !rejectionReason.trim()) return;

    try {
      await rejectRequest.mutateAsync({
        requestId: selectedRequest.id,
        rejectionReason: rejectionReason.trim(),
      });
      setRejectDialogOpen(false);
      setSelectedRequest(null);
      setRejectionReason("");
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleApproveSubmit = async () => {
    if (!selectedRequest) return;

    try {
      await approveRequest.mutateAsync({
        requestId: selectedRequest.id,
        createNewTrack: approveAction === "create",
        mergeIntoTrackId: approveAction === "merge" ? mergeTrackId : undefined,
      });
      setApproveDialogOpen(false);
      setSelectedRequest(null);
      setApproveAction("create");
      setMergeTrackId(undefined);
    } catch (error) {
      // Error handled by hook
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "Rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  const pendingRequests = requests?.filter((r) => r.status === "Pending") || [];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Track Requests</CardTitle>
          <CardDescription>
            Review and manage track requests from users
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!requests || !Array.isArray(requests) || requests.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No track requests found.
            </p>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-start justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-lg">
                        {request.trackName}
                      </span>
                      {getStatusBadge(request.status)}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {request.requestedBy && (
                        <p>
                          Requested by: {request.requestedBy.firstName}{" "}
                          {request.requestedBy.lastName} ({request.requestedBy.email})
                        </p>
                      )}
                      <p>
                        Requested:{" "}
                        {new Date(request.requestedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {request.processedAt && (
                        <p>
                          Processed:{" "}
                          {new Date(request.processedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                      {request.rejectionReason && (
                        <p className="text-destructive">
                          Rejection reason: {request.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>
                  {request.status === "Pending" && (
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleApproveClick(request)}
                        disabled={
                          approveRequest.isPending || rejectRequest.isPending
                        }
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRejectClick(request)}
                        disabled={
                          approveRequest.isPending || rejectRequest.isPending
                        }
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Track Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting the track request "{selectedRequest?.trackName}".
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejectionReason">Rejection Reason</Label>
              <Textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter the reason for rejection..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false);
                setRejectionReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectSubmit}
              disabled={!rejectionReason.trim() || rejectRequest.isPending}
            >
              {rejectRequest.isPending ? "Rejecting..." : "Reject Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Track Request</DialogTitle>
            <DialogDescription>
              How would you like to approve the track request "{selectedRequest?.trackName}"?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Action</Label>
              <Select
                value={approveAction}
                onValueChange={(value) =>
                  setApproveAction(value as "create" | "merge")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="create">Create New Track</SelectItem>
                  <SelectItem value="merge">Merge into Existing Track</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {approveAction === "merge" && (
              <div className="space-y-2">
                <Label htmlFor="mergeTrack">Select Track to Merge Into</Label>
                <Select
                  value={mergeTrackId?.toString()}
                  onValueChange={(value) => setMergeTrackId(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a track..." />
                  </SelectTrigger>
                  <SelectContent>
                    {tracks?.map((track) => (
                      <SelectItem key={track.id} value={track.id.toString()}>
                        {track.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setApproveDialogOpen(false);
                setApproveAction("create");
                setMergeTrackId(undefined);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApproveSubmit}
              disabled={
                approveRequest.isPending ||
                (approveAction === "merge" && !mergeTrackId)
              }
            >
              {approveRequest.isPending ? "Approving..." : "Approve Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

