interface HistoryItem {
  year: string;
  title?: string;
  description: string | string[];
}

interface AboutHistoryProps {
  title: string;
  items: HistoryItem[];
}

export const AboutHistory = ({ title, items }: AboutHistoryProps) => {
  return (
    <section className="py-12 md:py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">{title}</h2>
          <div className="space-y-8">
            {items.map((item, index) => (
              <div key={index} className="border-l-4 border-primary pl-6 py-2">
                <h3 className="text-xl md:text-2xl font-semibold mb-3 text-foreground">
                  {item.title ? `${item.year} - ${item.title}` : item.year}
                </h3>
                {Array.isArray(item.description) ? (
                  item.description.map((para, paraIndex) => (
                    <p
                      key={paraIndex}
                      className={`text-base md:text-lg text-foreground leading-relaxed ${
                        paraIndex > 0 ? "mt-3" : ""
                      }`}
                    >
                      {para}
                    </p>
                  ))
                ) : (
                  <p className="text-base md:text-lg text-foreground leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

