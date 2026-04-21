import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
    getPressReleaseCount,
    getPressReleasesOrderedSlice,
} from "@/lib/sanity.queries";
import { PressReleaseCard } from "@/components/PressReleaseCard";
import type { SanityPressRelease } from "@/lib/sanity.types";
import { applySeo, getCanonicalUrl } from "@/lib/seo";
import { CrawlPagination } from "@/components/seo/CrawlPagination";

const HUB_FIRST = 12;
const PAGE_SIZE = 12;

const PressReleasesArchive = () => {
    const [searchParams] = useSearchParams();
    const [items, setItems] = useState<SanityPressRelease[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const currentPage = useMemo(() => {
        const raw = parseInt(searchParams.get("page") || "1", 10);
        return Number.isFinite(raw) && raw >= 1 ? raw : 1;
    }, [searchParams]);

    const archiveTotal = Math.max(0, totalCount - HUB_FIRST);
    const totalPages = Math.max(1, Math.ceil(archiveTotal / PAGE_SIZE) || 1);
    const safePage = Math.min(currentPage, totalPages);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            const total = await getPressReleaseCount();
            if (cancelled) return;
            const arch = Math.max(0, total - HUB_FIRST);
            const pages = Math.max(1, Math.ceil(arch / PAGE_SIZE) || 1);
            const page = Math.min(Math.max(1, currentPage), pages);
            const start = HUB_FIRST + (page - 1) * PAGE_SIZE;
            const end = start + PAGE_SIZE;
            const slice =
                arch === 0
                    ? []
                    : await getPressReleasesOrderedSlice(start, end);
            if (!cancelled) {
                setTotalCount(total);
                setItems(slice);
                setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [currentPage]);

    useEffect(() => {
        const path = "/news/media-and-press/press-releases/archive";
        const qs = safePage > 1 ? `?page=${safePage}` : "";
        applySeo({
            title: `Press releases archive${safePage > 1 ? ` (page ${safePage})` : ""} | China Coast Community`,
            description:
                "Browse press releases and announcements from China Coast Community.",
            url: getCanonicalUrl(`${path}${qs}`),
        });
        return () => applySeo();
    }, [safePage]);

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />

            <main id="main-content" className="flex-1">
                <section className="bg-primary text-primary-foreground py-12 md:py-16">
                    <div className="container mx-auto px-4 w-full">
                        <div className="max-w-4xl">
                            <nav
                                className="text-sm opacity-90 mb-4"
                                aria-label="Breadcrumb"
                            >
                                <ol className="flex flex-wrap gap-x-2 gap-y-1 list-none pl-0 m-0">
                                    <li>
                                        <Link
                                            to="/"
                                            className="underline underline-offset-2"
                                        >
                                            Home
                                        </Link>
                                    </li>
                                    <li aria-hidden="true">/</li>
                                    <li>
                                        <Link
                                            to="/news/media-and-press"
                                            className="underline underline-offset-2"
                                        >
                                            Media and press
                                        </Link>
                                    </li>
                                    <li aria-hidden="true">/</li>
                                    <li className="font-medium">
                                        Press releases archive
                                    </li>
                                </ol>
                            </nav>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                                Press releases archive
                            </h1>
                            <p className="text-lg opacity-90 max-w-2xl">
                                Older releases, newest first.{" "}
                                <Link
                                    to="/news/media-and-press"
                                    className="underline underline-offset-2 font-medium"
                                >
                                    Back to media and press
                                </Link>
                                .
                            </p>
                        </div>
                    </div>
                </section>

                <section className="py-16">
                    <div className="container mx-auto px-4">
                        {loading ? (
                            <p className="text-center text-muted-foreground">
                                Loading press releases…
                            </p>
                        ) : archiveTotal === 0 ? (
                            <p className="text-center text-muted-foreground max-w-xl mx-auto">
                                All press releases are shown on the main media
                                page.
                            </p>
                        ) : (
                            <>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-2 max-w-7xl mx-auto">
                                    {items.map((pr) => (
                                        <PressReleaseCard
                                            key={pr._id}
                                            pressRelease={pr}
                                        />
                                    ))}
                                </div>
                                <div className="mt-12 max-w-4xl mx-auto">
                                    <CrawlPagination
                                        basePath="/news/media-and-press/press-releases/archive"
                                        currentPage={safePage}
                                        totalPages={totalPages}
                                        ariaLabel="Press releases pages"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default PressReleasesArchive;
