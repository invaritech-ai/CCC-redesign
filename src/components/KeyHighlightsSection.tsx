import { Target, Users, HeartHandshake } from "lucide-react";
import { HighlightCard } from "./HighlightCard";

export const KeyHighlightsSection = () => {
    const highlights = [
        {
            title: "Future Plans",
            description:
                "Discover our vision for redevelopment and expansion to serve more seniors across Hong Kong.",
            icon: Target,
            link: "/redevelopment",
            category: "Vision",
        },
        {
            title: "Community Programs",
            description:
                "Join over 80 community members in regular activities, outings, and social connections.",
            icon: Users,
            link: "/care-community/community-members-programme",
            category: "Community",
        },
        {
            title: "Volunteer",
            description:
                "Make a difference by donating your time. Help us create a caring community for Hong Kong's elderly.",
            icon: HeartHandshake,
            link: "/get-involved/volunteer",
            category: "Get Involved",
        },
    ];

    return (
        <section className="py-12 md:py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
