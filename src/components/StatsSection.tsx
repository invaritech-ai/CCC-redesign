import { Award, Users, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

export const StatsSection = () => {
  const stats = [
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
            <Card key={index} className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              {stat.number && (
                <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
              )}
              <div className="text-sm font-medium text-foreground">{stat.label}</div>
              {stat.subtitle && (
                <div className="text-sm text-muted-foreground mt-1">{stat.subtitle}</div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
