interface TimelineItem {
  year: string;
  title?: string;
  description: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

export const Timeline = ({ items }: TimelineProps) => {
  if (!items || items.length === 0) return null;

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {items.map((item, index) => (
              <div key={index} className="border-l-4 border-primary pl-6 py-2">
                <h3 className="text-xl md:text-2xl font-semibold mb-3 text-foreground">
                  {item.title ? `${item.year} - ${item.title}` : item.year}
                </h3>
                <p className="text-base md:text-lg text-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

