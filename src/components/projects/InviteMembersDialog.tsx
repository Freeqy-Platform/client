import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { invitationService } from "@/services/invitationService";
import type { ProjectInvitation } from "@/types/invitation";
import { InvitationStatus } from "@/types/invitation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Loader2,
    Send,
    Mail,
    Clock,
    Check,
    X,
    RefreshCw,
    Trash2,
    User,
} from "lucide-react";
import { toast } from "sonner";

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

const inviteSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

interface InviteMembersDialogProps {
    projectId: string;
    projectName: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function InviteMembersDialog({
    projectId,
    projectName,
    open,
    onOpenChange,
}: InviteMembersDialogProps) {
    const [invitations, setInvitations] = useState<ProjectInvitation[]>([]);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const form = useForm<InviteFormValues>({
        resolver: zodResolver(inviteSchema),
        defaultValues: {
            email: "",
        },
    });

    useEffect(() => {
        if (open) {
            fetchInvitations();
        }
    }, [open, projectId]);

    const fetchInvitations = async () => {
        try {
            setLoading(true);
            const data = await invitationService.getProjectInvitations(projectId);
            // Ensure data is an array
            setInvitations(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch invitations", error);
            setInvitations([]);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (values: InviteFormValues) => {
        try {
            setSending(true);
            await invitationService.sendInvitation(projectId, {
                email: values.email,
            });
            toast.success(`Invitation sent to ${values.email}`);
            form.reset();
            fetchInvitations();
        } catch (error: any) {
            console.error("Failed to send invitation", error);

            // Extract error message from various response formats
            let message = "Failed to send invitation";
            const responseData = error?.response?.data;

            if (typeof responseData === "string") {
                message = responseData;
            } else if (responseData?.title) {
                message = responseData.title;
            } else if (responseData?.message) {
                message = responseData.message;
            } else if (responseData?.errors) {
                // Handle validation errors object
                const firstError = Object.values(responseData.errors)[0];
                if (Array.isArray(firstError)) {
                    message = firstError[0] as string;
                }
            }

            // Handle 409 Conflict specifically
            if (error?.response?.status === 409) {
                message = "An invitation has already been sent to this user";
            }

            toast.error(message);
        } finally {
            setSending(false);
        }
    };

    const handleCancel = async (invitationId: string) => {
        try {
            setProcessingId(invitationId);
            await invitationService.cancelInvitation(invitationId);
            toast.success("Invitation cancelled");
            fetchInvitations();
        } catch (error) {
            console.error("Failed to cancel invitation", error);
            toast.error("Failed to cancel invitation");
        } finally {
            setProcessingId(null);
        }
    };

    const handleResend = async (invitationId: string) => {
        try {
            setProcessingId(invitationId);
            await invitationService.resendInvitation(invitationId);
            toast.success("Invitation resent");
            fetchInvitations();
        } catch (error) {
            console.error("Failed to resend invitation", error);
            toast.error("Failed to resend invitation");
        } finally {
            setProcessingId(null);
        }
    };

    const getStatusBadge = (status: InvitationStatus) => {
        switch (status) {
            case InvitationStatus.Pending:
                return (
                    <Badge variant="secondary" className="gap-1 text-xs">
                        <Clock className="h-3 w-3" />
                        Pending
                    </Badge>
                );
            case InvitationStatus.Accepted:
                return (
                    <Badge variant="default" className="gap-1 text-xs bg-green-600">
                        <Check className="h-3 w-3" />
                        Accepted
                    </Badge>
                );
            case InvitationStatus.Rejected:
                return (
                    <Badge variant="destructive" className="gap-1 text-xs">
                        <X className="h-3 w-3" />
                        Declined
                    </Badge>
                );
            case InvitationStatus.Expired:
                return (
                    <Badge
                        variant="outline"
                        className="gap-1 text-xs text-muted-foreground"
                    >
                        <Clock className="h-3 w-3" />
                        Expired
                    </Badge>
                );
            default:
                return null;
        }
    };

    const pendingInvitations = (invitations || []).filter(
        (inv) => inv.status === InvitationStatus.Pending
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Invite Members
                    </DialogTitle>
                    <DialogDescription>
                        Send invitations to add team members to "{projectName}"
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <div className="flex gap-2">
                                        <FormControl>
                                            <Input
                                                placeholder="user@example.com"
                                                type="email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <Button type="submit" disabled={sending} className="gap-1">
                                            {sending ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Send className="h-4 w-4" />
                                            )}
                                            Send
                                        </Button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>

                <div className="border-t pt-4 flex-1 min-h-0">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-muted-foreground">
                            Sent Invitations ({pendingInvitations.length} pending)
                        </h4>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={fetchInvitations}
                            disabled={loading}
                        >
                            <RefreshCw
                                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                            />
                        </Button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                    ) : invitations.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No invitations sent yet</p>
                        </div>
                    ) : (
                        <div className="h-[250px] overflow-y-auto pr-2">
                            <div className="space-y-3">
                                {invitations.map((invitation) => (
                                    <div
                                        key={invitation.inviteId}
                                        className="flex items-center justify-between p-3 rounded-lg border bg-card"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <User className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium truncate">
                                                    {invitation.invitedEmail}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatTimeAgo(invitation.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {getStatusBadge(invitation.status)}
                                            {invitation.status === InvitationStatus.Pending && (
                                                <div className="flex gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7"
                                                        onClick={() => handleResend(invitation.inviteId)}
                                                        disabled={processingId === invitation.inviteId}
                                                        title="Resend"
                                                    >
                                                        {processingId === invitation.inviteId ? (
                                                            <Loader2 className="h-3 w-3 animate-spin" />
                                                        ) : (
                                                            <RefreshCw className="h-3 w-3" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 text-destructive hover:text-destructive"
                                                        onClick={() => handleCancel(invitation.inviteId)}
                                                        disabled={processingId === invitation.inviteId}
                                                        title="Cancel"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
