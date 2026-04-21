import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type AdjacentLink = {
    to: string;
    label: string;
};

type Props = {
    prev?: AdjacentLink | null;
    next?: AdjacentLink | null;
    className?: string;
};

/**
 * Crawlable previous/next navigation for detail pages (SEO + orientation).
 */
export function DetailAdjacentLinks({ prev, next, className }: Props) {
    if (!prev && !next) return null;

    return (
        <nav
            className={className}
            aria-label="Previous and next in this section"
        >
            <ul className="flex flex-col sm:flex-row gap-3 sm:gap-4 list-none pl-0 m-0">
                {prev ? (
                    <li className="flex-1 min-w-0">
                        <Link
                            to={prev.to}
                            className="flex items-start gap-2 rounded-md border bg-card px-4 py-3 text-sm font-medium text-primary hover:bg-accent hover:text-accent-foreground transition-colors min-h-[44px]"
                        >
                            <ChevronLeft
                                className="h-5 w-5 shrink-0 mt-0.5"
                                aria-hidden="true"
                            />
                            <span className="text-left">
                                <span className="block text-xs text-muted-foreground font-normal">
                                    Previous
                                </span>
                                <span className="line-clamp-2">{prev.label}</span>
                            </span>
                        </Link>
                    </li>
                ) : (
                    <li className="flex-1 hidden sm:block" aria-hidden="true" />
                )}
                {next ? (
                    <li className="flex-1 min-w-0 sm:text-right">
                        <Link
                            to={next.to}
                            className="flex items-start justify-end gap-2 rounded-md border bg-card px-4 py-3 text-sm font-medium text-primary hover:bg-accent hover:text-accent-foreground transition-colors min-h-[44px]"
                        >
                            <span className="text-right order-1 sm:order-none">
                                <span className="block text-xs text-muted-foreground font-normal">
                                    Next
                                </span>
                                <span className="line-clamp-2">{next.label}</span>
                            </span>
                            <ChevronRight
                                className="h-5 w-5 shrink-0 mt-0.5 order-2 sm:order-none"
                                aria-hidden="true"
                            />
                        </Link>
                    </li>
                ) : null}
            </ul>
        </nav>
    );
}
