interface HowCareContinuesSectionProps {
  title: string;
  paragraphs: string[];
  teamActivities: string[];
  closingParagraph?: string;
}

export const HowCareContinuesSection = ({
  title,
  paragraphs,
  teamActivities,
  closingParagraph,
}: HowCareContinuesSectionProps) => {
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
            {teamActivities.length > 0 && (
              <div className="mt-8">
                <p className="text-base md:text-lg font-semibold text-foreground mb-4">
                  CCC's nursing and outreach team:
                </p>
                <ul className="space-y-3 list-none">
                  {teamActivities.map((activity, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-base md:text-lg text-foreground leading-relaxed"
                    >
                      <span className="text-primary font-bold mt-1">•</span>
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {closingParagraph && (
              <p className="text-base md:text-lg text-foreground leading-relaxed mt-6">
                {closingParagraph}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

