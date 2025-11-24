import { Building2, Users, Heart, Shield } from "lucide-react";

interface Quote {
  text: string;
  author: string;
}

interface WhatIsBeingBuiltSectionProps {
  title: string;
  introParagraph?: string;
  intentions?: string[];
  paragraphs?: React.ReactNode[];
  quotes?: Quote[];
}

const intentionIcons = [Building2, Users, Shield, Heart];

export const WhatIsBeingBuiltSection = ({
  title,
  introParagraph,
  intentions,
  paragraphs,
  quotes,
}: WhatIsBeingBuiltSectionProps) => {
  return (
    <section className="py-12 md:py-20 bg-secondary/30 relative overflow-hidden">

      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            {title}
          </h2>
          <div className="space-y-6">
            {introParagraph && (
              <p className="text-base md:text-lg text-foreground leading-relaxed">
                {introParagraph}
              </p>
            )}
            {intentions && intentions.length > 0 && (
              <div className="grid md:grid-cols-2 gap-4 my-8">
                {intentions.map((intention, index) => {
                  const Icon = intentionIcons[index % intentionIcons.length];
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-card rounded-lg shadow-sm border border-border/50 hover:shadow-md transition-shadow"
                    >
                      <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-base md:text-lg text-foreground leading-relaxed pt-1">
                        {intention}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
            {paragraphs &&
              paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-base md:text-lg text-foreground leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            {quotes &&
              quotes.map((quote, index) => (
                <blockquote
                  key={index}
                  className="border-l-4 border-primary pl-6 py-4 bg-card/50 backdrop-blur-sm rounded-r-lg italic text-base md:text-lg text-foreground shadow-sm"
                >
                  {quote.text}{" "}
                  <span className="font-semibold not-italic">
                    — {quote.author}
                  </span>
                </blockquote>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

