import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface WhereResidentsAreNowSectionProps {
  title: string;
  paragraphs: string[];
  communityItems: string[];
}

export const WhereResidentsAreNowSection = ({
  title,
  paragraphs,
  communityItems,
}: WhereResidentsAreNowSectionProps) => {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
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
            {communityItems.length > 0 && (
              <div className="mt-8">
                <p className="text-base md:text-lg font-semibold text-foreground mb-4">
                  To maintain our community:
                </p>
                <ul className="space-y-3 list-none">
                  {communityItems.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-base md:text-lg text-foreground leading-relaxed"
                    >
                      <span className="text-primary font-bold mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-8">
              <p className="text-base md:text-lg text-foreground leading-relaxed">
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

