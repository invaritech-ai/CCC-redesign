import { Quote, User } from "lucide-react";
import { Card } from "@/components/ui/card";

export const FeaturedStorySection = () => {
  // This will be replaced with CMS data
  const featuredStory = {
    quote: "CCC has given me a wonderful community of friends. The activities and outings keep me engaged, and I never feel alone. It's truly a caring family that has transformed my life in Hong Kong.",
    name: "Margaret Chen",
    role: "Community Member",
    detail: "Member since 2015",
    image: null, // Will be replaced with CMS image
  };

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

              {/* Featured quote */}
              <p className="text-xl md:text-2xl text-foreground mb-8 leading-relaxed italic font-medium">
                "{featuredStory.quote}"
              </p>

              {/* Author info */}
              <div className="flex items-center gap-4 pt-6 border-t">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  {featuredStory.image ? (
                    <img
                      src={featuredStory.image}
                      alt={featuredStory.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-primary" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-lg">
                    {featuredStory.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {featuredStory.role} • {featuredStory.detail}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

