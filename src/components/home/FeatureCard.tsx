import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconBgColor: string;
  iconColor: string;
  cardBgColor: string;
  className?: string;
}

export const FeatureCard = ({
  icon: Icon,
  title,
  description,
  iconBgColor,
  iconColor,
  cardBgColor,
  className,
}: FeatureCardProps) => {
  return (
    <Card
      className={cn(
        "border-0 shadow-sm transition-all hover:shadow-md",
        className
      )}
      style={{ backgroundColor: cardBgColor }}
    >
      <CardContent className="p-6">
        <div className="mb-4">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-lg"
            style={{ backgroundColor: iconBgColor }}
          >
            <Icon className="h-6 w-6" style={{ color: iconColor }} />
          </div>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};
