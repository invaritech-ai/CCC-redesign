import { Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getLatestTestimonials } from "@/lib/sanity.queries";

export const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const data = await getLatestTestimonials(10);
      setTestimonials(data);
      setLoading(false);
    };
    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl text-foreground mb-4">
              A Special Place Residents Call Home
            </h2>
          </div>
          <p className="text-center text-muted-foreground">Loading...</p>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl text-foreground mb-4">
              A Special Place Residents Call Home
            </h2>
          </div>
          <div className="max-w-5xl mx-auto">
            <p className="text-center text-muted-foreground">
              No testimonials available at this time. Check back soon!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl text-foreground mb-4">
            A Special Place Residents Call Home
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card key={testimonial._id} className="p-6 md:p-8 relative hover:shadow-lg transition-shadow">
              <Quote className="h-10 w-10 text-primary/20 mb-4" />
              <p className="text-lg text-foreground mb-6 leading-relaxed italic">
                "{testimonial.quote}"
              </p>
              <div className="border-t pt-4">
                <p className="font-semibold text-foreground">
                  {testimonial.name || testimonial.role || 'Community Member'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role && testimonial.detail 
                    ? `${testimonial.role}${testimonial.detail ? ` • ${testimonial.detail}` : ''}`
                    : testimonial.detail || testimonial.role || ''}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
