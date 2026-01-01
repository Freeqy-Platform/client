import type { User } from "@/types/user";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  const fullName = `${user.firstName} ${user.lastName}`;
  const initials = `${user.firstName?.[0] || ""}${
    user.lastName?.[0] || ""
  }`.toUpperCase();
  const topSkills = user.skills?.slice(0, 3) || [];

  return (
    <div className="h-full flex flex-col">
      <div className="py-6 flex flex-col h-full">
        <div className="flex flex-col items-center text-center mb-4">
          <Link to={`/users/${user.id}`} className="mb-3">
            <Avatar className="h-24 w-24 mb-2">
              <AvatarImage
                src={user.photoUrl || undefined}
                className="object-cover"
                alt={fullName}
              />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Link>
          <Link to={`/users/${user.id}`} className="hover:underline">
            <h3 className="font-semibold text-lg mb-1">{fullName}</h3>
          </Link>
          {user.track && (
            <Badge variant="secondary" className="mb-2">
              {user.track}
            </Badge>
          )}
          {user.summary && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
              {user.summary}
            </p>
          )}
        </div>

        {topSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 justify-center">
            {topSkills.map((skill, index) => (
              <Badge
                key={skill.id || index}
                variant="outline"
                className="text-xs"
              >
                {skill.name}
              </Badge>
            ))}
            {user.skills && user.skills.length > 3 && (
              <span className="text-xs text-muted-foreground self-center">
                +{user.skills.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
