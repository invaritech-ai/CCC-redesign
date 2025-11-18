import { useEffect, useState } from "react";
import { getInitiatives } from "@/lib/sanity.queries";
import type { SanityUpdate } from "@/lib/sanity.types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

export const UpcomingInitiativesSection = () => {
  const [initiatives, setInitiatives] = useState<SanityUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitiatives = async () => {
      try {
        const data = await getInitiatives();
        setInitiatives(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchInitiatives();
  }, []);

  if (loading) {
    return (
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Upcoming Initiatives</h2>
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading initiatives...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (initiatives.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Upcoming Initiatives</h2>
          <div className="space-y-6">
            {initiatives.map((initiative) => (
              <Card key={initiative._id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-foreground">
                          {initiative.title}
                        </h3>
                        {initiative.featured && (
                          <Badge variant="default" className="shrink-0">
                            Featured
                          </Badge>
                        )}
                      </div>
                      {initiative.excerpt && (
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {initiative.excerpt}
                        </p>
                      )}
                      {initiative.publishedAt && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <time dateTime={initiative.publishedAt}>
                            {new Date(initiative.publishedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </time>
                        </div>
                      )}
                    </div>
                    {initiative.slug?.current && (
                      <Link
                        to={`/updates/${initiative.slug.current}`}
                        className="text-primary hover:underline font-medium shrink-0"
                      >
                        Learn more →
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

