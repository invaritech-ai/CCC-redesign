import { Quote, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getFeaturedUpdate } from "@/lib/sanity.queries";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export const FeaturedStorySection = () => {
  const [featuredStory, setFeaturedStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      const story = await getFeaturedUpdate();
      setFeaturedStory(story);
      setLoading(false);
    };
    fetchStory();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl text-foreground mb-4">
              A Special Place Residents Call Home
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from our community members about their experiences
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 md:p-12">
              <p className="text-muted-foreground text-center">Loading...</p>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  if (!featuredStory) {
    return (
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl text-foreground mb-4">
              A Special Place Residents Call Home
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from our community members about their experiences
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 md:p-12">
              <p className="text-muted-foreground text-center">
                No featured story available at this time.
              </p>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl text-foreground mb-4">
            A Special Place Residents Call Home
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from our community members about their experiences
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-8 md:p-12 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10">
              {/* Quote icon */}
              <div className="mb-6">
                <Quote className="h-12 w-12 text-primary/20" />
              </div>

              {/* Featured story title */}
              <h3 className="text-2xl md:text-3xl text-foreground mb-4 font-semibold">
                {featuredStory.title}
              </h3>

              {/* Featured excerpt */}
              {featuredStory.excerpt && (
                <p className="text-lg md:text-xl text-foreground mb-8 leading-relaxed">
                  {featuredStory.excerpt}
                </p>
              )}

              {/* Story info */}
              <div className="flex items-center gap-4 pt-6 border-t">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  {featuredStory.imageUrl ? (
                    <img
                      src={featuredStory.imageUrl}
                      alt={featuredStory.title}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  {featuredStory.author && (
                    <p className="font-semibold text-foreground text-lg">
                      {featuredStory.author}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {featuredStory.publishedAt && format(new Date(featuredStory.publishedAt), "PPP")}
                    {featuredStory.type && ` • ${featuredStory.type}`}
                  </p>
                  {featuredStory.slug?.current && (
                    <Link
                      to={`/updates/${featuredStory.slug.current}`}
                      className="text-primary hover:underline text-sm mt-2 inline-block"
                    >
                      Read full story →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

