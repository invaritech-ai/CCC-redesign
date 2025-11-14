import { Heart, Users, Calendar } from "lucide-react";
import { HighlightCard } from "./HighlightCard";

export const ServicesSection = () => {
  const services = [
    {
      icon: Heart,
      title: "Care & Attention Home",
      description: "24-hour professional nursing care in a warm, home-like environment. Our licensed facility ensures residents receive dignified care as their needs change.",
      link: "/waitlist",
      category: "Care Services",
    },
    {
      icon: Users,
      title: "Community Members Program",
      description: "Over 80 members enjoy regular outings, activities, and social connections while living independently. A vibrant community to ease loneliness.",
      link: "/community",
      category: "Community",
    },
    {
      icon: Calendar,
      title: "Activities & Outings",
      description: "Regular social events, cultural outings, and activities that bring both residents and community members together to make new friends.",
      link: "/events",
      category: "Events",
    },
  ];

  return (
    <section className="py-12 md:py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl text-foreground mb-4">What We Do</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive care and community programs for Hong Kong's English-speaking elderly
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {services.map((service, index) => (
            <HighlightCard
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
              link={service.link}
              category={service.category}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
