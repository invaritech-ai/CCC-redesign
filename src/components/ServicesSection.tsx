import { Heart, Users, Calendar, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const ServicesSection = () => {
  const services = [
    {
      icon: Heart,
      title: "Care & Attention Home",
      description: "24-hour professional nursing care in a warm, home-like environment. Our licensed facility ensures residents receive dignified care as their needs change.",
    },
    {
      icon: Users,
      title: "Community Members Program",
      description: "Over 80 members enjoy regular outings, activities, and social connections while living independently. A vibrant community to ease loneliness.",
    },
    {
      icon: Calendar,
      title: "Activities & Outings",
      description: "Regular social events, cultural outings, and activities that bring both residents and community members together to make new friends.",
    },
  ];

  return (
    <section className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl text-primary mb-4">What We Do</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive care and community programs for Hong Kong's English-speaking elderly
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="p-8 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <service.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">{service.title}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>
              <Button variant="link" className="p-0 h-auto text-primary">
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
