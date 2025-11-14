import { Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getLatestTestimonials } from "@/lib/sanity.queries";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

export const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const data = await getLatestTestimonials(10);
      setTestimonials(data);
      setLoading(false);
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Auto-scroll functionality with pause on hover
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!api || testimonials.length <= 1 || isPaused) {
      return;
    }

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0); // Loop back to start
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [api, testimonials.length, isPaused]);

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl text-foreground mb-4">
              A Special Place Residents Call Home
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from our community members about their experiences
            </p>
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
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from our community members about their experiences
            </p>
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
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from our community members about their experiences
          </p>
        </div>

        <div 
          className="max-w-3xl mx-auto relative px-12 md:px-16"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial._id}>
                  <Card className="p-6 md:p-8 relative hover:shadow-lg transition-shadow">
                    <Quote className="h-10 w-10 text-primary/20 mb-4" />
                    <p className="text-lg md:text-xl text-foreground mb-6 leading-relaxed italic">
                      "{testimonial.quote}"
                    </p>
                    <div className="border-t pt-4">
                      <p className="font-semibold text-foreground text-lg md:text-xl">
                        {testimonial.name || testimonial.role || 'Community Member'}
                      </p>
                      <p className="text-sm md:text-base text-muted-foreground">
                        {testimonial.role && testimonial.detail 
                          ? `${testimonial.role}${testimonial.detail ? ` • ${testimonial.detail}` : ''}`
                          : testimonial.detail || testimonial.role || ''}
                      </p>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            {testimonials.length > 1 && (
              <>
                <CarouselPrevious className="h-10 w-10 md:h-12 md:w-12" />
                <CarouselNext className="h-10 w-10 md:h-12 md:w-12" />
              </>
            )}
          </Carousel>
          
          {/* Dots indicator */}
          {testimonials.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`h-6 w-6 rounded-full transition-all p-2 min-h-[44px] min-w-[44px] flex items-center justify-center ${
                    index === current
                      ? "bg-primary"
                      : "bg-primary/30"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <span className={`h-2 w-2 rounded-full ${
                    index === current ? "bg-white" : "bg-primary"
                  }`} aria-hidden="true" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
