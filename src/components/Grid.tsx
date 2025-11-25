import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import * as FaIcons from "react-icons/fa";
import * as HiIcons from "react-icons/hi";
import * as MdIcons from "react-icons/md";
import * as BsIcons from "react-icons/bs";
import * as FiIcons from "react-icons/fi";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as Io5Icons from "react-icons/io5";
import * as RiIcons from "react-icons/ri";
import * as TbIcons from "react-icons/tb";

interface GridItem {
    icon: string;
    title: string;
    description: string;
}

interface GridProps {
    items: GridItem[];
}

// Helper function to get dynamic grid column classes based on item count
const getGridColsClass = (count: number): string => {
    if (count === 1) {
        return "grid-cols-1 max-w-md mx-auto";
    } else if (count === 2) {
        return "grid-cols-1 md:grid-cols-2";
    } else if (count === 3) {
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    } else if (count === 4) {
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4";
    } else if (count === 5) {
        // 2-2-1 pattern: 3 columns on desktop, last item spans or we use 2-2-1
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    } else if (count === 6) {
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    } else {
        // 7+ items: responsive grid
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
    }
};

// Helper function to get subtle background colors for cards
const getCardBackgroundColor = (index: number): string => {
    const colors = [
        "bg-primary/5",      // Very light primary/green
        "bg-success/5",      // Very light success/green variant
        "bg-secondary/20",   // Light secondary/gray
        "bg-primary/10",     // Slightly more primary
        "bg-muted/50",       // Light muted
    ];
    return colors[index % colors.length];
};

// Helper function to resolve icon component from icon name string
// Supports icons from multiple react-icons sets (Fa*, Hi*, Md*, Bs*, Fi*, Ai*, Io*, Io5*, Ri*, Tb*)
const resolveIcon = (iconName: string): React.ComponentType<{ className?: string }> | null => {
    // Create a mapping of all icon sets
    const iconSets = [
        FaIcons,
        HiIcons,
        MdIcons,
        BsIcons,
        FiIcons,
        AiIcons,
        IoIcons,
        Io5Icons,
        RiIcons,
        TbIcons,
    ];

    // Try to find the icon in any of the icon sets
    for (const iconSet of iconSets) {
        const iconKey = iconName as keyof typeof iconSet;
        if (iconKey && iconSet[iconKey]) {
            return iconSet[iconKey] as React.ComponentType<{ className?: string }>;
        }
    }

    // If not found, return null (will be handled gracefully)
    return null;
};

export const Grid = ({ items }: GridProps) => {
    if (!items || items.length === 0) return null;

    const gridColsClass = getGridColsClass(items.length);

    return (
        <section className="py-12 md:py-20">
            <div className="container mx-auto px-4">
                <div className={`grid ${gridColsClass} gap-6 max-w-6xl mx-auto`}>
                    {items.map((item, index) => {
                        const IconComponent = resolveIcon(item.icon);
                        const bgColor = getCardBackgroundColor(index);

                        return (
                            <Card 
                                key={index} 
                                className={`${bgColor} transition-all duration-300 hover:shadow-md hover:-translate-y-1`}
                            >
                                <CardContent className="pt-6">
                                    <div className="flex gap-4">
                                        {IconComponent && (
                                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                                <IconComponent className="h-6 w-6 text-primary" aria-hidden="true" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold mb-2 text-foreground">
                                                {item.title}
                                            </h3>
                                            <p className="text-base text-foreground leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

