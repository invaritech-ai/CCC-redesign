import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Calendar, HeartHandshake } from "lucide-react";

interface WhereResidentsAreNowSectionProps {
  title?: string;
  paragraphs: string[];
  communityItems: string[];
}

const communityIcons = [Users, Calendar, HeartHandshake];

export const WhereResidentsAreNowSection = ({
  title,
  paragraphs,
  communityItems,
}: WhereResidentsAreNowSectionProps) => {
  return (
    <section
      className="relative py-12 md:py-20"
      style={{
        backgroundImage: `url(/Central Lawn (20230613).webp)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-background/90" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
              {title}
            </h2>
          )}
          <div className="space-y-6">
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-base md:text-lg text-foreground leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
            {communityItems.length > 0 && (
              <div className="mt-8 grid md:grid-cols-3 gap-6">
                {communityItems.map((item, index) => {
                  const Icon = communityIcons[index % communityIcons.length];
                  return (
                    <div
                      key={index}
                      className="bg-card/80 backdrop-blur-sm p-6 rounded-lg shadow-md border border-border/50 text-center hover:shadow-lg transition-shadow"
                    >
                      <div className="flex justify-center mb-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                          <Icon className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                      <p className="text-base md:text-lg text-foreground leading-relaxed">
                        {item}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="mt-8 bg-card/80 backdrop-blur-sm p-6 rounded-lg shadow-md">
              <p className="text-base md:text-lg text-foreground leading-relaxed text-center">
                You can read more about our current services on our{" "}
                <Link
                  to="/care-community/community-members-programme"
                  className="text-primary hover:underline font-medium"
                >
                  Care & Community
                </Link>{" "}
                pages.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
