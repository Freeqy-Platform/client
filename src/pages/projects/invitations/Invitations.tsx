import { useState, useEffect } from "react";
import { invitationService } from "@/services/invitationService";
import type { ProjectInvitation, MyInvitationsResponse } from "@/types/invitation";
import { InvitationStatus } from "@/types/invitation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Mail,
  Check,
  X,
  Clock,
  Calendar,
  User,
  FolderKanban,
  MailOpen,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

// Helper function to format relative time
const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return date.toLocaleDateString();
};

const Invitations = () => {
  const [pendingInvitations, setPendingInvitations] = useState<ProjectInvitation[]>([]);
  const [respondedInvitations, setRespondedInvitations] = useState<ProjectInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedInvitation, setSelectedInvitation] =
    useState<ProjectInvitation | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      const data: MyInvitationsResponse = await invitationService.getMyInvitations();
      console.log("API Response for invitations:", data);
      setPendingInvitations(data.pendingInvitations || []);
      setRespondedInvitations(data.respondedInvitations || []);
    } catch (error) {
      console.error("Failed to fetch invitations", error);
      toast.error("Failed to load invitations");
      setPendingInvitations([]);
      setRespondedInvitations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (invitation: ProjectInvitation) => {
    try {
      setRespondingId(invitation.inviteId);
      await invitationService.respondToInvitation({
        invitationId: invitation.inviteId,
        accept: true,
      });
      toast.success(`You have joined "${invitation.projectName}"!`);
      fetchInvitations();
    } catch (error) {
      console.error("Failed to accept invitation", error);
      toast.error("Failed to accept invitation");
    } finally {
      setRespondingId(null);
    }
  };

  const openRejectDialog = (invitation: ProjectInvitation) => {
    setSelectedInvitation(invitation);
    setRejectionReason("");
    setRejectDialogOpen(true);
  };

  const handleReject = async () => {
    if (!selectedInvitation) return;

    try {
      setRespondingId(selectedInvitation.inviteId);
      await invitationService.respondToInvitation({
        invitationId: selectedInvitation.inviteId,
        accept: false,
        rejectionReason: rejectionReason || undefined,
      });
      toast.success("Invitation declined");
      setRejectDialogOpen(false);
      fetchInvitations();
    } catch (error) {
      console.error("Failed to reject invitation", error);
      toast.error("Failed to decline invitation");
    } finally {
      setRespondingId(null);
    }
  };

  const getStatusBadge = (status: InvitationStatus) => {
    switch (status) {
      case InvitationStatus.Pending:
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case InvitationStatus.Accepted:
        return (
          <Badge variant="default" className="gap-1 bg-green-600">
            <Check className="h-3 w-3" />
            Accepted
          </Badge>
        );
      case InvitationStatus.Rejected:
        return (
          <Badge variant="destructive" className="gap-1">
            <X className="h-3 w-3" />
            Declined
          </Badge>
        );
      case InvitationStatus.Expired:
        return (
          <Badge variant="outline" className="gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" />
            Expired
          </Badge>
        );
      default:
        return null;
    }
  };

  const allInvitations = [...pendingInvitations, ...respondedInvitations];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Mail className="h-8 w-8" />
            Project Invitations
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your project invitations. Accept to join teams or decline if
            you're not interested.
          </p>
        </div>
        <Button variant="outline" onClick={fetchInvitations} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {allInvitations.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <MailOpen className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Invitations Yet</h3>
            <p className="text-muted-foreground text-center max-w-md">
              You haven't received any project invitations. When project owners
              invite you to join their projects, they'll appear here.
            </p>
            <Button variant="outline" className="mt-6" asChild>
              <Link to="/projects">Browse Projects</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Pending Invitations */}
          {pendingInvitations.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                Pending Invitations ({pendingInvitations.length})
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pendingInvitations.map((invitation) => (
                  <Card
                    key={invitation.inviteId}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">
                            <Link
                              to={`/projects/${invitation.projectId}`}
                              className="hover:underline flex items-center gap-2"
                            >
                              <FolderKanban className="h-4 w-4" />
                              {invitation.projectName}
                            </Link>
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            Invited by {invitation.sentByName}
                          </CardDescription>
                        </div>
                        {getStatusBadge(invitation.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Received {formatTimeAgo(invitation.createdAt)}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 gap-1"
                          onClick={() => handleAccept(invitation)}
                          disabled={respondingId === invitation.inviteId}
                        >
                          {respondingId === invitation.inviteId ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 gap-1"
                          onClick={() => openRejectDialog(invitation)}
                          disabled={respondingId === invitation.inviteId}
                        >
                          <X className="h-4 w-4" />
                          Decline
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* History */}
          {respondedInvitations.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 text-muted-foreground">
                History
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {respondedInvitations.map((invitation) => (
                  <Card key={invitation.inviteId} className="opacity-75">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">
                            <Link
                              to={`/projects/${invitation.projectId}`}
                              className="hover:underline flex items-center gap-2"
                            >
                              <FolderKanban className="h-4 w-4" />
                              {invitation.projectName}
                            </Link>
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            From {invitation.sentByName}
                          </CardDescription>
                        </div>
                        {getStatusBadge(invitation.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{formatTimeAgo(invitation.createdAt)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Reject Dialog */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Decline Invitation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to decline the invitation to join "
              {selectedInvitation?.projectName}"? You can optionally provide a
              reason.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <Label htmlFor="rejectionReason">Reason (optional)</Label>
            <Textarea
              id="rejectionReason"
              placeholder="I'm currently busy with other projects..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="mt-2"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={respondingId !== null}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={respondingId !== null}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {respondingId ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Decline
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Invitations;
