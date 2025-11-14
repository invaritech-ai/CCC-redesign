import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEventBySlug } from "@/lib/sanity.queries";
import { Calendar, MapPin, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const EventDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (slug) {
        const data = await getEventBySlug(slug);
        setEvent(data);
      }
      setLoading(false);
    };
    fetchEvent();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1">
          <section className="bg-primary text-primary-foreground py-20">
            <div className="container mx-auto px-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Event</h1>
            </div>
          </section>
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <p className="text-muted-foreground">Loading...</p>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1">
          <section className="bg-primary text-primary-foreground py-20">
            <div className="container mx-auto px-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Event</h1>
            </div>
          </section>
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <p className="text-lg text-muted-foreground">
                  Event not found.
                </p>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4">
            {event.featured && (
              <Badge variant="secondary" className="mb-4">Featured Event</Badge>
            )}
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{event.title}</h1>
            <div className="flex flex-wrap gap-4 text-lg opacity-90">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{format(new Date(event.date), "PPP 'at' p")}</span>
              </div>
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-96 object-cover rounded-lg mb-8"
                />
              )}
              
              {event.description && (
                <div className="prose prose-lg max-w-none mb-8">
                  <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                    {event.description}
                  </p>
                </div>
              )}

              {event.registrationLink && (
                <Button asChild className="mt-6">
                  <a
                    href={event.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Register Now <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}

              {event.category && (
                <div className="mt-8">
                  <Badge variant="outline">{event.category}</Badge>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default EventDetail;

