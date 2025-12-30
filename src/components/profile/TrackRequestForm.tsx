import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useCreateTrackRequest, useTrackRequestStats } from "../../hooks/user/userHooks";
import { Info, Sparkles, AlertCircle } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "../../lib/utils";

export const TrackRequestForm: React.FC = () => {
  const [trackName, setTrackName] = useState("");
  const createTrackRequest = useCreateTrackRequest();
  const { data: stats, isLoading: statsLoading } = useTrackRequestStats();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackName.trim()) return;

    try {
      await createTrackRequest.mutateAsync({ trackName: trackName.trim() });
      setTrackName("");
    } catch (error) {
      // Error handled by hook
    }
  };

  const canSubmit = trackName.trim().length > 0 && !stats?.dailyLimitExceeded;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Request New Track
        </CardTitle>
        <CardDescription>
          Can't find your track? Request a new one and our admins will review it.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {statsLoading ? (
          <Skeleton className="h-20 w-full" />
        ) : stats?.dailyLimitExceeded ? (
          <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
            <div className="text-sm text-destructive">
              You can only submit one track request per day. Please try again
              {stats.nextRequestAllowedAt && (
                <span>
                  {" "}
                  on{" "}
                  {new Date(stats.nextRequestAllowedAt).toLocaleDateString()}
                </span>
              )}
              .
            </div>
          </div>
        ) : (
          <>
            {stats && (
              <div className="rounded-md bg-muted p-3 flex items-start gap-2">
                <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="text-sm text-muted-foreground">
                  You've submitted {stats.requestsUsedThisMonth} track request(s) this month.
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="trackName">Track Name</Label>
                <Input
                  id="trackName"
                  value={trackName}
                  onChange={(e) => setTrackName(e.target.value)}
                  placeholder="e.g., Machine Learning, DevOps"
                  disabled={createTrackRequest.isPending}
                />
              </div>
              <Button
                type="submit"
                disabled={!canSubmit || createTrackRequest.isPending}
                className="w-full"
              >
                {createTrackRequest.isPending
                  ? "Submitting..."
                  : "Submit Request"}
              </Button>
            </form>
          </>
        )}
      </CardContent>
    </Card>
  );
};

