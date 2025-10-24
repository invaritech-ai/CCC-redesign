import { Quote } from "lucide-react";
import { Card } from "@/components/ui/card";

export const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "CCC has given me a wonderful community of friends. The activities and outings keep me engaged, and I never feel alone. It's truly a caring family.",
      role: "Community Member",
      detail: "Since 2015",
    },
    {
      quote: "The staff at CCC treat my mother with such dignity and respect. Knowing she's in safe hands gives our family peace of mind. We're grateful for their dedication.",
      role: "Family Member",
      detail: "Resident's Daughter",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl text-primary mb-4">
            A Special Place Residents Call Home
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-8 relative hover:shadow-lg transition-shadow">
              <Quote className="h-10 w-10 text-primary/20 mb-4" />
              <p className="text-lg text-foreground mb-6 leading-relaxed italic">
                "{testimonial.quote}"
              </p>
              <div className="border-t pt-4">
                <p className="font-semibold text-primary">{testimonial.role}</p>
                <p className="text-sm text-muted-foreground">{testimonial.detail}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
