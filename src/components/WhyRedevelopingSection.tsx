interface WhyRedevelopingSectionProps {
  title: string;
  paragraphs: string[];
  benefits: string[];
  quote?: {
    text: string;
    author: string;
  };
}

export const WhyRedevelopingSection = ({
  title,
  paragraphs,
  benefits,
  quote,
}: WhyRedevelopingSectionProps) => {
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
            {quote && (
              <blockquote className="border-l-4 border-primary pl-6 py-2 italic text-base md:text-lg text-foreground">
                {quote.text}{" "}
                <span className="font-semibold not-italic">
                  — {quote.author}
                </span>
              </blockquote>
            )}
            {benefits.length > 0 && (
              <div className="mt-8">
                <p className="text-base md:text-lg font-semibold text-foreground mb-4">
                  The redevelopment will:
                </p>
                <ul className="space-y-3 list-none">
                  {benefits.map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-base md:text-lg text-foreground leading-relaxed"
                    >
                      <span className="text-primary font-bold mt-1">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

