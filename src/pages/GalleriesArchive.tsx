import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
    getGalleryCount,
    getGalleriesOrderedSlice,
} from "@/lib/sanity.queries";
import { GalleryCard } from "@/components/GalleryCard";
import type { SanityGallery } from "@/lib/sanity.types";
import { applySeo, getCanonicalUrl } from "@/lib/seo";
import { CrawlPagination } from "@/components/seo/CrawlPagination";

const HUB_FIRST = 12;
const PAGE_SIZE = 12;

const GalleriesArchive = () => {
    const [searchParams] = useSearchParams();
    const [items, setItems] = useState<SanityGallery[]>([]);
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
            const total = await getGalleryCount();
            if (cancelled) return;
            const arch = Math.max(0, total - HUB_FIRST);
            const pages = Math.max(1, Math.ceil(arch / PAGE_SIZE) || 1);
            const page = Math.min(Math.max(1, currentPage), pages);
            const start = HUB_FIRST + (page - 1) * PAGE_SIZE;
            const end = start + PAGE_SIZE;
            const slice =
                arch === 0
                    ? []
                    : await getGalleriesOrderedSlice(start, end);
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
        const path = "/news/media-and-press/galleries/archive";
        const qs = safePage > 1 ? `?page=${safePage}` : "";
        applySeo({
            title: `Photo galleries archive${safePage > 1 ? ` (page ${safePage})` : ""} | China Coast Community`,
            description:
                "Browse photo galleries from China Coast Community events and activities.",
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
                                        Galleries archive
                                    </li>
                                </ol>
                            </nav>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                                Photo galleries archive
                            </h1>
                            <p className="text-lg opacity-90 max-w-2xl">
                                Older galleries, newest first.{" "}
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
                                Loading galleries…
                            </p>
                        ) : archiveTotal === 0 ? (
                            <p className="text-center text-muted-foreground max-w-xl mx-auto">
                                All galleries are shown on the main media page.
                            </p>
                        ) : (
                            <>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-2 max-w-7xl mx-auto">
                                    {items.map((gallery) => (
                                        <GalleryCard
                                            key={gallery._id}
                                            gallery={gallery}
                                        />
                                    ))}
                                </div>
                                <div className="mt-12 max-w-4xl mx-auto">
                                    <CrawlPagination
                                        basePath="/news/media-and-press/galleries/archive"
                                        currentPage={safePage}
                                        totalPages={totalPages}
                                        ariaLabel="Gallery archive pages"
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

export default GalleriesArchive;
