import { Calendar, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFeaturedEvents, getRecentUpdate } from "@/lib/sanity.queries";
import { format } from "date-fns";

export const NoticeboardSection = () => {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      const [events, update] = await Promise.all([
        getFeaturedEvents(),
        getRecentUpdate(),
      ]);

      const noticesList: any[] = [];

      // Add recent update if available
      if (update) {
        noticesList.push({
          _id: update._id,
          date: format(new Date(update.publishedAt), "MMMM yyyy"),
          type: update.type || "Update",
          title: update.title,
          description: update.excerpt || "",
          featured: update.featured,
          slug: update.slug?.current,
          link: `/updates/${update.slug?.current}`,
        });
      }

      // Add upcoming events
      events.forEach((event: any) => {
        noticesList.push({
          _id: event._id,
          date: format(new Date(event.date), "MMMM yyyy"),
          type: "Event",
          title: event.title,
          description: event.description || "",
          featured: event.featured,
          slug: event.slug?.current,
          link: `/events/${event.slug?.current}`,
        });
      });

      // Sort by date (most recent first)
      noticesList.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });
      
      setNotices(noticesList.slice(0, 4)); // Limit to 4
      setLoading(false);
    };
    fetchNotices();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl text-foreground mb-4">Noticeboard</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay updated on our redevelopment progress, community events, and ways you can help
            </p>
          </div>
          <p className="text-center text-muted-foreground">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl text-foreground mb-4">Noticeboard</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay updated on our redevelopment progress, community events, and ways you can help
          </p>
        </div>

        {notices.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {notices.map((notice) => (
              <Card key={notice._id} className={`p-6 hover:shadow-lg transition-shadow ${notice.featured ? 'md:col-span-2 bg-primary/5' : ''}`}>
                {notice.featured && (
                  <Badge variant="default" className="mb-4">Featured</Badge>
                )}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-muted-foreground">{notice.date}</span>
                      <Badge variant="neutral" className="text-xs">{notice.type}</Badge>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{notice.title}</h3>
                    <p className="text-muted-foreground mb-4">{notice.description}</p>
                    {notice.link && (
                      <Button variant="link" className="p-0 h-auto" asChild>
                        <Link to={notice.link}>
                          Read more <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground mb-12">
            <p>No notices available at this time. Check back soon!</p>
          </div>
        )}

        {/* Subscribe Section */}
        <Card className="p-8 bg-secondary/50 border-primary/20">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-2xl font-semibold text-foreground mb-2">Stay Updated</h3>
            <p className="text-muted-foreground mb-6">
              Subscribe to receive the latest news and updates about our redevelopment progress
            </p>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1"
              />
              <Button variant="success">Subscribe</Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
