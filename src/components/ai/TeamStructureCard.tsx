import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Briefcase } from "lucide-react";
import type { TeamRole } from "@/types/aiAnalysis";

interface TeamStructureCardProps {
  role: TeamRole;
}

export function TeamStructureCard({ role }: TeamStructureCardProps) {
  const priorityColors = {
    High: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
    Medium: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
    Low: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold line-clamp-2">
              {role.role}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Briefcase className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-muted-foreground truncate">
                {role.track}
              </span>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`${priorityColors[role.priority]} flex-shrink-0`}
          >
            {role.priority}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Recommended:</span>
          <span className="font-semibold">{role.recommended_members}</span>
          <span className="text-muted-foreground">
            {role.recommended_members === 1 ? "member" : "members"}
          </span>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Required Skills:</p>
          <div className="flex flex-wrap gap-2">
            {role.skills.map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs font-normal"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

