import { Target, Users, ClipboardList, HeartHandshake } from "lucide-react";
import { HighlightCard } from "./HighlightCard";

export const KeyHighlightsSection = () => {
    const highlights = [
        {
            title: "Future Plans",
            description:
                "Discover our vision for redevelopment and expansion to serve more seniors across Hong Kong.",
            icon: Target,
            link: "/future",
            category: "Vision",
        },
        {
            title: "Community Programs",
            description:
                "Join over 80 community members in regular activities, outings, and social connections.",
            icon: Users,
            link: "/community",
            category: "Community",
        },
        {
            title: "Join Waitlist",
            description:
                "Express interest in our Care & Attention Home. We'll contact you when spaces become available.",
            icon: ClipboardList,
            link: "/waitlist",
            category: "Care Home",
        },
        {
            title: "Volunteer",
            description:
                "Make a difference by donating your time. Help us create a caring community for Hong Kong's elderly.",
            icon: HeartHandshake,
            link: "/volunteer",
            category: "Get Involved",
        },
    ];

    return (
        <section className="py-12 md:py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8 md:mb-12">
                    <h2 className="text-3xl md:text-4xl text-foreground mb-4">
                        How You Can Get Involved
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Explore ways to connect with our community and support
                        Hong Kong's English-speaking elderly
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {highlights.map((highlight, index) => (
                        <HighlightCard
                            key={index}
                            title={highlight.title}
                            description={highlight.description}
                            icon={highlight.icon}
                            link={highlight.link}
                            category={highlight.category}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
