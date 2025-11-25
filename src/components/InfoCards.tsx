import React from "react";
import { InfoCard, InfoCardItem } from "./InfoCard";

interface InfoCardsProps {
    items: InfoCardItem[];
}

// Helper function to get dynamic grid column classes based on item count
const getGridColsClass = (count: number): string => {
    if (count === 1) {
        return "grid-cols-1 max-w-md mx-auto";
    }
    // Max 2 columns for all other cases as requested
    return "grid-cols-1 md:grid-cols-2";
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

export const InfoCards = ({ items }: InfoCardsProps) => {
    if (!items || items.length === 0) return null;

    return (
        <section className="py-8 md:py-12">
            <div className="container mx-auto px-4">
                <div className={`grid gap-4 md:gap-5 auto-rows-fr ${items.length > 1 ? "max-w-5xl mx-auto" : ""} ${getGridColsClass(items.length)}`}>
                    {items.map((item, index) => {
                        const bgColor = getCardBackgroundColor(index);

                        return (
                            <div key={index} className="min-w-0">
                                <InfoCard item={item} index={index} bgColor={bgColor} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

