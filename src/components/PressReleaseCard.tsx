import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import type { SanityPressRelease } from "@/lib/sanity.types";

interface PressReleaseCardProps {
    pressRelease: SanityPressRelease;
}

// Helper to extract excerpt from portable text blocks
const getExcerpt = (content?: any[]): string => {
    if (!content || !Array.isArray(content)) return "";
    
    // Get first text block
    const firstBlock = content.find(
        (block) => block._type === "block" && block.children
    );
    
    if (!firstBlock || !firstBlock.children) return "";
    
    // Extract text from children
    const text = firstBlock.children
        .map((child: any) => child.text || "")
        .join("")
        .trim();
    
    // Return first 150 characters
    return text.length > 150 ? text.substring(0, 150) + "..." : text;
};

export const PressReleaseCard = ({ pressRelease }: PressReleaseCardProps) => {
    const releaseDate = pressRelease.date
        ? format(new Date(pressRelease.date), "PPP")
        : null;
    
    const excerpt = getExcerpt(pressRelease.content);
    const mediaLinksCount = pressRelease.mediaLinks?.length || 0;
    
    const pressReleaseSlug = pressRelease.slug?.current;
    const linkPath = pressReleaseSlug
        ? `/news/media-and-press/press-releases/${pressReleaseSlug}`
        : "#";

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    {releaseDate && (
                        <span className="text-xs font-semibold text-muted-foreground">
                            {releaseDate}
                        </span>
                    )}
                    {pressRelease.featured && (
                        <span className="text-xs font-semibold text-primary">
                            Featured
                        </span>
                    )}
                </div>
                <h2 className="text-lg font-semibold mb-2 leading-tight line-clamp-2">
                    {pressRelease.title}
                </h2>
                {excerpt && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                        {excerpt}
                    </p>
                )}
                {mediaLinksCount > 0 && (
                    <div className="flex items-center gap-1 mb-3 text-sm text-muted-foreground">
                        <ExternalLink className="h-4 w-4" />
                        <span>{mediaLinksCount} media link{mediaLinksCount !== 1 ? "s" : ""}</span>
                    </div>
                )}
                {pressReleaseSlug && (
                    <Link
                        to={linkPath}
                        className="inline-flex items-center text-primary hover:underline text-base font-semibold"
                    >
                        Read more{" "}
                        <ArrowRight
                            className="ml-2 h-5 w-5"
                            aria-hidden="true"
                        />
                    </Link>
                )}
            </div>
        </Card>
    );
};

