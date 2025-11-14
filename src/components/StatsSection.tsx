import { Award, Users, CheckCircle } from "lucide-react";
import { useCountUp } from "@/hooks/use-count-up";

interface StatItem {
  icon: React.ComponentType<{ className?: string }>;
  number?: string;
  label: string;
  subtitle?: string;
}

const StatCard = ({ stat }: { stat: StatItem }) => {
  // Extract numeric value and suffix from strings like "45+" or "80+"
  const extractNumber = (value: string): { num: number; suffix: string } => {
    const match = value.match(/^(\d+)(.*)$/);
    if (match) {
      return { num: parseInt(match[1], 10), suffix: match[2] };
    }
    return { num: 0, suffix: "" };
  };

  const targetValue = stat.number ? extractNumber(stat.number).num : 0;
  const { count, ref } = useCountUp(targetValue);
  const suffix = stat.number ? extractNumber(stat.number).suffix : "";

  return (
    <div ref={ref} className="p-8 text-center">
      <div className="flex justify-center mb-4">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <stat.icon className="h-6 w-6 text-primary" />
        </div>
      </div>
      {stat.number && (
        <div className="text-4xl font-bold text-foreground mb-2">
          {count}
          {suffix}
        </div>
      )}
      <div className="text-sm font-medium text-foreground">{stat.label}</div>
      {stat.subtitle && (
        <div className="text-sm text-muted-foreground mt-1">{stat.subtitle}</div>
      )}
    </div>
  );
};

export const StatsSection = () => {
  const stats: StatItem[] = [
    {
      icon: Award,
      number: "45+",
      label: "Years Serving HK",
    },
    {
      icon: Users,
      number: "80+",
      label: "Community Members",
    },
    {
      icon: CheckCircle,
      label: "Licensed",
      subtitle: "Care & Attention Home",
    },
  ];

  return (
    <section className="py-12 -mt-8 relative z-10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
};
