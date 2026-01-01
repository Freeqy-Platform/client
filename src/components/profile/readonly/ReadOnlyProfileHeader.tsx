import React from "react";
import { Card, CardContent, CardHeader } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Mail, Phone, Calendar, MapPin, CheckCircle2 } from "lucide-react";
import type { User } from "../../../types/user";

interface ReadOnlyProfileHeaderProps {
  user: User;
}

export const ReadOnlyProfileHeader: React.FC<ReadOnlyProfileHeaderProps> = ({
  user,
}) => {
  return (
    <Card className="mt-12 border-0 shadow-md">
      <CardHeader className="pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {user.firstName} {user.lastName}
          </h1>
          {user.userName && (
            <p className="text-sm text-muted-foreground">@{user.userName}</p>
          )}
          {user.track && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              <Badge variant="secondary" className="text-xs font-normal">
                {user.track}
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {user.email && (
            <div className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="truncate">{user.email}</span>
              {user.isEmailConfirmed && (
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
              )}
            </div>
          )}
          {user.phoneNumber && (
            <div className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span>{user.phoneNumber}</span>
            </div>
          )}
          {user.availability && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <Badge variant="outline" className="text-xs font-normal">
                {user.availability}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

