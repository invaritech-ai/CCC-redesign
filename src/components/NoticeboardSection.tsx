import { Calendar, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const NoticeboardSection = () => {
  const notices = [
    {
      date: "December 2024",
      type: "Update",
      title: "Redevelopment Progress Update",
      description: "Construction is progressing well. New facility will feature modern amenities, enhanced accessibility, and expanded community spaces.",
      featured: true,
    },
    {
      date: "November 2024",
      type: "Appeal",
      title: "Fundraising Milestone Reached",
      description: "Thanks to our generous donors, we've reached 60% of our redevelopment funding goal. Every donation brings us closer to reopening.",
    },
    {
      date: "October 2024",
      type: "Event",
      title: "Community Members Reunion Event",
      description: "Join us for a special reunion event to reconnect with community members and learn about our future plans.",
    },
    {
      date: "September 2024",
      type: "Report",
      title: "Annual Report 2023/2024 Published",
      description: "Our latest annual report is now available, detailing our impact, financials, and vision for the future.",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl text-primary mb-4">Noticeboard</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay updated on our redevelopment progress, community events, and ways you can help
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {notices.map((notice, index) => (
            <Card key={index} className={`p-6 hover:shadow-lg transition-shadow ${notice.featured ? 'md:col-span-2 bg-primary/5' : ''}`}>
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
                  <h3 className="text-xl font-semibold text-primary mb-2">{notice.title}</h3>
                  <p className="text-muted-foreground mb-4">{notice.description}</p>
                  <Button variant="link" className="p-0 h-auto">
                    Read more <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Subscribe Section */}
        <Card className="p-8 bg-secondary/50 border-primary/20">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-2xl font-semibold text-primary mb-2">Stay Updated</h3>
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
