interface Quote {
  text: string;
  author: string;
}

interface WhatIsBeingBuiltSectionProps {
  title: string;
  introParagraph?: string;
  intentions?: string[];
  paragraphs?: string[];
  quotes?: Quote[];
}

export const WhatIsBeingBuiltSection = ({
  title,
  introParagraph,
  intentions,
  paragraphs,
  quotes,
}: WhatIsBeingBuiltSectionProps) => {
  return (
    <section className="py-12 md:py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
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
              <ul className="space-y-3 list-none">
                {intentions.map((intention, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-base md:text-lg text-foreground leading-relaxed"
                  >
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>{intention}</span>
                  </li>
                ))}
              </ul>
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
                  className="border-l-4 border-primary pl-6 py-2 italic text-base md:text-lg text-foreground"
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

