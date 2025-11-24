import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface AboutRedevelopmentSectionProps {
  title: string;
  paragraphs: string[];
  linkText?: string;
  linkHref?: string;
}

export const AboutRedevelopmentSection = ({
  title,
  paragraphs,
  linkText = "Learn more about our Redevelopment",
  linkHref = "/redevelopment",
}: AboutRedevelopmentSectionProps) => {
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
          </div>
          {linkText && linkHref && (
            <div className="mt-8 md:mt-10 text-center">
              <Button variant="outline" size="lg" className="gap-2" asChild>
                <Link to={linkHref}>
                  {linkText}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

