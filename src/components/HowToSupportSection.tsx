import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DonateNowButton } from "./DonateNowButton";
import { Mail, ArrowRight } from "lucide-react";

interface HowToSupportSectionProps {
  title: string;
  paragraphs: string[];
  supportOptions: string[];
}

export const HowToSupportSection = ({
  title,
  paragraphs,
  supportOptions,
}: HowToSupportSectionProps) => {
  return (
    <section className="py-12 md:py-20 bg-secondary/30">
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
            {supportOptions.length > 0 && (
              <div className="mt-8">
                <p className="text-base md:text-lg font-semibold text-foreground mb-4">
                  You can support CCC by:
                </p>
                <ul className="space-y-3 list-none">
                  {supportOptions.map((option, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-base md:text-lg text-foreground leading-relaxed"
                    >
                      <span className="text-primary font-bold mt-1">•</span>
                      <span>{option}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-8 text-center">
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

