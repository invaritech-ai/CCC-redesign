import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface InfoCardItem {
    title: string;
    subtitle?: string;
    bulletPoints: string[];
    closingStatement?: string;
}

interface InfoCardProps {
    item: InfoCardItem;
    index: number;
    bgColor: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({ item, index, bgColor }) => {
    return (
        <Card 
            className={`${bgColor} transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col border-opacity-50 w-full`}
        >
            <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold text-foreground leading-tight">
                    {item.title}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-3">
                {item.subtitle && (
                    <p className="text-lg font-medium text-foreground/80 leading-relaxed">
                        {item.subtitle}
                    </p>
                )}
                
                {item.bulletPoints.length > 0 && (
                    <ul className="list-disc list-outside space-y-2 ml-5 pl-1 flex-1">
                        {item.bulletPoints.map((point, idx) => (
                            <li key={idx} className="text-lg text-foreground/90 leading-relaxed">
                                {point}
                            </li>
                        ))}
                    </ul>
                )}
                
                {item.closingStatement && (
                    <p className="text-lg text-foreground/80 italic leading-relaxed pt-3 mt-auto border-t border-border/40">
                        {item.closingStatement}
                    </p>
                )}
            </CardContent>
        </Card>
    );
};

