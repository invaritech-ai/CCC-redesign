import { useCountUp } from "@/hooks/use-count-up";
import { Card } from "@/components/ui/card";

interface StatItem {
  number: string;
  label: string;
}

interface StatsCardsProps {
  stats: StatItem[];
}

const StatCard = ({ stat }: { stat: StatItem }) => {
  // Extract numeric value and suffix from strings like "78" or "131"
  const extractNumber = (value: string): { num: number; suffix: string } => {
    const match = value.match(/^(\d+)(.*)$/);
    if (match) {
      return { num: parseInt(match[1], 10), suffix: match[2] };
    }
    return { num: 0, suffix: "" };
  };

  const targetValue = extractNumber(stat.number).num;
  const { count, ref } = useCountUp(targetValue);
  const suffix = extractNumber(stat.number).suffix;

  return (
    <Card ref={ref} className="p-6 md:p-8 text-center">
      <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
        {count}
        {suffix}
      </div>
      <div className="text-base md:text-lg font-medium text-foreground">
        {stat.label}
      </div>
    </Card>
  );
};

export const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid md:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-10">
      {stats.map((stat, index) => (
        <StatCard key={index} stat={stat} />
      ))}
    </div>
  );
};

