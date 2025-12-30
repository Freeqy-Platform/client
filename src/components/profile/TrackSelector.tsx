import React, { useState, useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Check, Search, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useTracks, useUpdateTrackSmart } from "../../hooks/user/userHooks";
import { useCreateTrackRequest } from "../../hooks/user/userHooks";
import { Skeleton } from "../ui/skeleton";
import { cn } from "../../lib/utils";

interface TrackSelectorProps {
  value?: string;
  onChange: (trackName: string) => void;
  onCancel?: () => void;
  className?: string;
}

export const TrackSelector: React.FC<TrackSelectorProps> = ({
  value,
  onChange,
  onCancel,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState(value || "");
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [suggestedTracks, setSuggestedTracks] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: tracks, isLoading } = useTracks();
  const updateTrackSmart = useUpdateTrackSmart();
  const createTrackRequest = useCreateTrackRequest();

  // Filter tracks based on search query
  const filteredTracks = React.useMemo(() => {
    if (!tracks || !searchQuery.trim()) {
      return tracks || [];
    }
    const query = searchQuery.toLowerCase();
    return tracks.filter((track) =>
      track.name.toLowerCase().includes(query)
    );
  }, [tracks, searchQuery]);

  // Find similar tracks (simple similarity check)
  useEffect(() => {
    if (searchQuery.trim() && tracks) {
      const query = searchQuery.toLowerCase();
      const similar = tracks
        .filter((track) => {
          const name = track.name.toLowerCase();
          return (
            name.includes(query) ||
            query.includes(name) ||
            name.split(" ").some((word) => word.startsWith(query)) ||
            query.split(" ").some((word) => name.includes(word))
          );
        })
        .slice(0, 3)
        .map((t) => t.name);
      setSuggestedTracks(similar);
    } else {
      setSuggestedTracks([]);
    }
  }, [searchQuery, tracks]);

  const handleSelectTrack = (trackName: string) => {
    onChange(trackName);
    setIsOpen(false);
    setSearchQuery(trackName);
  };

  const handleCreateNew = async () => {
    if (!searchQuery.trim()) return;

    try {
      // Try smart update first (will suggest similar tracks or create if confirmCreate=true)
      await updateTrackSmart.mutateAsync({
        proposedTrackName: searchQuery.trim(),
        confirmCreate: true,
      });
      handleSelectTrack(searchQuery.trim());
      setShowCreateDialog(false);
    } catch (error) {
      // If smart update fails, show create dialog
      setShowCreateDialog(true);
    }
  };

  const handleConfirmCreate = async () => {
    if (!searchQuery.trim()) return;

    try {
      await createTrackRequest.mutateAsync({
        trackName: searchQuery.trim(),
      });
      setShowCreateDialog(false);
      setIsOpen(false);
      // Note: Track won't be set immediately, user needs to wait for approval
    } catch (error) {
      // Error handled by hook
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  return (
    <>
      <div ref={containerRef} className={cn("relative", className)}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search tracks..."
            className="pl-9 pr-9"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setIsOpen(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          )}
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
            {isLoading ? (
              <div className="p-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full mt-2" />
              </div>
            ) : filteredTracks.length > 0 ? (
              <div className="max-h-60 overflow-auto p-1">
                {filteredTracks.map((track) => (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => handleSelectTrack(track.name)}
                    className={cn(
                      "w-full flex items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-accent cursor-pointer",
                      value === track.name && "bg-accent"
                    )}
                  >
                    <span>{track.name}</span>
                    {value === track.name && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            ) : searchQuery.trim() ? (
              <div className="p-3 space-y-2">
                <p className="text-sm text-muted-foreground">
                  No tracks found matching "{searchQuery}"
                </p>
                {suggestedTracks.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Did you mean:
                    </p>
                    {suggestedTracks.map((trackName) => (
                      <button
                        key={trackName}
                        type="button"
                        onClick={() => handleSelectTrack(trackName)}
                        className="w-full text-left text-sm text-primary hover:underline"
                      >
                        {trackName}
                      </button>
                    ))}
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleCreateNew}
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  Request new track: "{searchQuery}"
                </Button>
              </div>
            ) : (
              <div className="p-3 text-sm text-muted-foreground">
                Start typing to search tracks...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Track Request Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request New Track</DialogTitle>
            <DialogDescription>
              The track "{searchQuery}" doesn't exist. Would you like to request
              it? An admin will review your request.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Badge variant="secondary" className="text-sm">
              {searchQuery}
            </Badge>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowCreateDialog(false);
                onCancel?.();
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmCreate}
              disabled={createTrackRequest.isPending}
            >
              {createTrackRequest.isPending
                ? "Submitting..."
                : "Submit Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

