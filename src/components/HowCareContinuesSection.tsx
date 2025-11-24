import { Phone, Calendar, Users } from "lucide-react";

interface HowCareContinuesSectionProps {
  title: string;
  paragraphs: string[];
  teamActivities: string[];
  closingParagraph?: string;
}

const activityIcons = [Phone, Calendar, Users];

export const HowCareContinuesSection = ({
  title,
  paragraphs,
  teamActivities,
  closingParagraph,
}: HowCareContinuesSectionProps) => {
  return (
    <section className="py-12 md:py-20 bg-secondary/30 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-success/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            {title}
          </h2>
          <div className="space-y-6">
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-base md:text-lg text-foreground leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
            {teamActivities.length > 0 && (
              <div className="mt-8">
                <p className="text-base md:text-lg font-semibold text-foreground mb-6 text-center">
                  CCC's nursing and outreach team:
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  {teamActivities.map((activity, index) => {
                    const Icon = activityIcons[index % activityIcons.length];
                    return (
                      <div
                        key={index}
                        className="bg-card p-5 rounded-lg shadow-sm border border-border/50 hover:shadow-md transition-shadow text-center"
                      >
                        <div className="flex justify-center mb-3">
                          <div className="p-2 bg-success/10 rounded-lg">
                            <Icon className="h-6 w-6 text-success" />
                          </div>
                        </div>
                        <p className="text-base text-foreground leading-relaxed">
                          {activity}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {closingParagraph && (
              <div className="mt-8 bg-primary/5 border-l-4 border-primary pl-6 py-4 rounded-r-lg">
                <p className="text-base md:text-lg text-foreground leading-relaxed italic">
                  {closingParagraph}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

