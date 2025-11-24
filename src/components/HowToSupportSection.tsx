import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DonateNowButton } from "./DonateNowButton";
import { Mail, ArrowRight, Heart, Handshake, Megaphone } from "lucide-react";

interface HowToSupportSectionProps {
  title: string;
  paragraphs: string[];
  supportOptions: string[];
}

const supportIcons = [Heart, Handshake, Megaphone];

export const HowToSupportSection = ({
  title,
  paragraphs,
  supportOptions,
}: HowToSupportSectionProps) => {
  return (
    <section
      className="relative py-12 md:py-20"
      style={{
        backgroundImage: `url(/Flower Arbor (20230613).webp)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-background/90" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            {title}
          </h2>
          <div className="space-y-6">
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-base md:text-lg text-foreground leading-relaxed text-center"
              >
                {paragraph}
              </p>
            ))}
            {supportOptions.length > 0 && (
              <div className="mt-8 grid md:grid-cols-3 gap-6">
                {supportOptions.map((option, index) => {
                  const Icon = supportIcons[index % supportIcons.length];
                  return (
                    <div
                      key={index}
                      className="bg-card/80 backdrop-blur-sm p-6 rounded-lg shadow-md border border-border/50 hover:shadow-lg transition-shadow text-center"
                    >
                      <div className="flex justify-center mb-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                          <Icon className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                      <p className="text-base md:text-lg text-foreground leading-relaxed">
                        {option}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="mt-8 text-center bg-card/80 backdrop-blur-sm p-8 rounded-lg shadow-md">
              <p className="text-base md:text-lg text-foreground leading-relaxed mb-6">
                To discuss how you can help, please{" "}
                <Link
                  to="/contact"
                  className="text-primary hover:underline font-medium"
                >
                  contact us
                </Link>{" "}
                or visit our{" "}
                <Link
                  to="/get-involved/volunteer"
                  className="text-primary hover:underline font-medium"
                >
                  Get Involved
                </Link>{" "}
                page.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <DonateNowButton size="lg" />
                <Button variant="outline" size="lg" className="gap-2" asChild>
                  <Link to="/get-involved/volunteer">
                    <Mail className="h-5 w-5" aria-hidden="true" />
                    Get Involved
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

