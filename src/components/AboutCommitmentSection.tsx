import { StatsCards } from "./StatsCards";

interface AboutCommitmentSectionProps {
  title: string;
  paragraphs: string[];
  stats: Array<{ number: string; label: string }>;
}

export const AboutCommitmentSection = ({
  title,
  paragraphs,
  stats,
}: AboutCommitmentSectionProps) => {
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
          </div>
          <StatsCards stats={stats} />
        </div>
      </div>
    </section>
  );
};

