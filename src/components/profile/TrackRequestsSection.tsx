import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { useMyTrackRequests } from "../../hooks/user/userHooks";
import { Skeleton } from "../ui/skeleton";
import { Clock, CheckCircle2, XCircle } from "lucide-react";

export const TrackRequestsSection: React.FC = () => {
  const { data: requests, isLoading } = useMyTrackRequests();

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
      <Card className="mt-4 border-0 shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4 border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">My Track Requests</CardTitle>
        <CardDescription>
          Track the status of your track requests
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!requests || !Array.isArray(requests) || requests.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            You haven't submitted any track requests yet.
          </p>
        ) : (
          <div className="space-y-3">
            {requests.map((request) => (
              <div
                key={request.id}
                className="flex items-start justify-between p-3 border rounded-lg"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{request.trackName}</span>
                    {getStatusBadge(request.status)}
                  </div>
                  <div className="text-xs text-muted-foreground space-y-0.5">
                    <p>
                      Requested:{" "}
                      {new Date(request.requestedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    {request.processedAt && (
                      <p>
                        Processed:{" "}
                        {new Date(request.processedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    )}
                    {request.rejectionReason && (
                      <p className="text-destructive">
                        Reason: {request.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

