interface WhyRedevelopingSectionProps {
  title: string;
  paragraphs: string[];
  benefits: string[];
  quote?: {
    text: string;
    author: string;
  };
  backgroundImage?: string;
}

export const WhyRedevelopingSection = ({
  title,
  paragraphs,
  benefits,
  quote,
  backgroundImage,
}: WhyRedevelopingSectionProps) => {
  return (
    <section
      className="relative py-12 md:py-20"
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : undefined
      }
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-background/85" />
      )}
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
            {quote && (
              <blockquote className="border-l-4 border-primary pl-6 py-4 bg-card/50 backdrop-blur-sm rounded-r-lg italic text-base md:text-lg text-foreground shadow-sm">
                {quote.text}{" "}
                <span className="font-semibold not-italic">
                  — {quote.author}
                </span>
              </blockquote>
            )}
            {benefits.length > 0 && (
              <div className="mt-8 bg-card/50 backdrop-blur-sm p-6 rounded-lg shadow-sm">
                <p className="text-base md:text-lg font-semibold text-foreground mb-4">
                  The redevelopment will:
                </p>
                <ul className="space-y-3 list-none">
                  {benefits.map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-base md:text-lg text-foreground leading-relaxed"
                    >
                      <span className="text-primary font-bold mt-1 text-xl">
                        ✓
                      </span>
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

