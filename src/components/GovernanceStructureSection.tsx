import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Users, Building2, Briefcase, Hammer, DollarSign } from "lucide-react";
import { ReactNode } from "react";

interface GovernanceItem {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface GovernanceStructureSectionProps {
  title: string;
  introText?: string | ReactNode;
  governanceItems: GovernanceItem[];
  orgChartImage?: string;
  orgChartPdfUrl?: string;
}

// Helper function to get subtle background colors for cards
const getCardBackgroundColor = (index: number): string => {
  const colors = [
    "bg-primary/5",      // Very light primary/green
    "bg-success/5",      // Very light success/green variant
    "bg-secondary/20",   // Light secondary/gray
    "bg-primary/10",     // Slightly more primary
    "bg-muted/50",       // Light muted
  ];
  return colors[index % colors.length];
};

export const GovernanceStructureSection = ({
  title,
  introText,
  governanceItems,
  orgChartImage = "/org-chart.png",
  orgChartPdfUrl,
}: GovernanceStructureSectionProps) => {
  return (
    <section className="py-12 md:py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              {title}
            </h2>
            {introText && (
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {introText}
              </p>
            )}
          </div>

          {/* Governance Items Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
            {governanceItems.map((item, index) => {
              const Icon = item.icon;
              const bgColor = getCardBackgroundColor(index);
              return (
                <Card
                  key={index}
                  className={`overflow-hidden ${bgColor} transition-all duration-300 hover:shadow-md hover:-translate-y-1`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2 text-foreground">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Organizational Chart Image */}
          <div className="mt-8">
            <div className="bg-background rounded-lg p-4 md:p-6 shadow-lg border border-border/50">
              <img
                src={orgChartImage}
                alt="Organizational Chart"
                className="w-full h-auto rounded-md"
              />
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Our governance structure ensures clear oversight and accountability
              </p>
              {orgChartPdfUrl && (
                <div className="mt-4 text-center">
                  <Button
                    variant="outline"
                    asChild
                    className="gap-2"
                  >
                    <a href={orgChartPdfUrl} download>
                      <Download className="h-4 w-4" />
                      Download organisational chart (PDF)
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
