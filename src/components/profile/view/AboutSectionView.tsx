import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { User } from "../../../types/user";

interface AboutSectionViewProps {
  user: User;
}

export const AboutSectionView: React.FC<AboutSectionViewProps> = ({
  user,
}) => {
  return (
    <Card className="mt-4 border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">About</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {user.summary ? (
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {user.summary}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No summary added yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

