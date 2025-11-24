import { PullQuote } from "./PullQuote";

interface AboutUniqueIdentityProps {
  title: string;
  paragraphs: string[];
  pullQuote?: string;
}

export const AboutUniqueIdentity = ({
  title,
  paragraphs,
  pullQuote,
}: AboutUniqueIdentityProps) => {
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
            {pullQuote && <PullQuote quote={pullQuote} />}
          </div>
        </div>
      </div>
    </section>
  );
};

