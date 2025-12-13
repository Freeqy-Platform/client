import { cn } from "@/lib/utils";

interface StatItemProps {
  value: string;
  label: string;
  className?: string;
}

const StatItem = ({ value, label, className }: StatItemProps) => {
  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      <p className="mb-2 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
        {value}
      </p>
      <p className="text-sm text-white/80 sm:text-base">{label}</p>
    </div>
  );
};

export const StatsSection = () => {
  const stats = [
    { value: "15,000+", label: "Active Users" },
    { value: "3,500+", label: "Projects Completed" },
    { value: "89%", label: "Success Rate" },
    { value: "50+", label: "Countries" },
  ];

  return (
    <section className="bg-[#1e293b] py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              value={stat.value}
              label={stat.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

