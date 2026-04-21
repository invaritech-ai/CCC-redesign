import { Link } from "react-router-dom";

type Props = {
    basePath: string;
    currentPage: number;
    totalPages: number;
    searchParams?: Record<string, string>;
    ariaLabel?: string;
    className?: string;
};

function buildHref(
    basePath: string,
    page: number,
    extra: Record<string, string>
): string {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", String(page));
    for (const [k, v] of Object.entries(extra)) {
        if (v) params.set(k, v);
    }
    const q = params.toString();
    return q ? `${basePath}?${q}` : basePath;
}

/**
 * Numbered pagination using real anchor hrefs for crawlers.
 */
export function CrawlPagination({
    basePath,
    currentPage,
    totalPages,
    searchParams = {},
    ariaLabel = "Pagination",
    className,
}: Props) {
    if (totalPages <= 1) return null;

    const pages: number[] = [];
    const windowSize = 5;
    let start = Math.max(1, currentPage - Math.floor(windowSize / 2));
    const end = Math.min(totalPages, start + windowSize - 1);
    start = Math.max(1, end - windowSize + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    return (
        <nav aria-label={ariaLabel} className={className}>
            <ul className="flex flex-wrap items-center justify-center gap-2 list-none pl-0 m-0">
                {currentPage > 1 ? (
                    <li>
                        <Link
                            to={buildHref(
                                basePath,
                                currentPage - 1,
                                searchParams
                            )}
                            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border px-3 text-sm font-medium text-primary hover:bg-accent"
                        >
                            Previous
                        </Link>
                    </li>
                ) : null}
                {pages.map((p) => (
                    <li key={p}>
                        {p === currentPage ? (
                            <span
                                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-primary bg-primary/10 px-3 text-sm font-semibold"
                                aria-current="page"
                            >
                                {p}
                            </span>
                        ) : (
                            <Link
                                to={buildHref(basePath, p, searchParams)}
                                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border px-3 text-sm font-medium text-primary hover:bg-accent"
                            >
                                {p}
                            </Link>
                        )}
                    </li>
                ))}
                {currentPage < totalPages ? (
                    <li>
                        <Link
                            to={buildHref(
                                basePath,
                                currentPage + 1,
                                searchParams
                            )}
                            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border px-3 text-sm font-medium text-primary hover:bg-accent"
                        >
                            Next
                        </Link>
                    </li>
                ) : null}
            </ul>
        </nav>
    );
}
