import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUpdateBySlug } from "@/lib/sanity.queries";
import { Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { getImageUrl, getImageUrlFromString } from "@/lib/sanityImage";
import type {
    SanityUpdate,
    SanityPortableTextBlock,
    SanityImageBlock,
} from "@/lib/sanity.types";

// Simple portable text renderer
const PortableText = ({ blocks }: { blocks: SanityPortableTextBlock[] }) => {
    if (!blocks || !Array.isArray(blocks)) return null;

    return (
        <div className="prose prose-lg max-w-none">
            {blocks.map((block, index: number) => {
                if (block._type === "block") {
                    const text =
                        block.children?.map((child) => child.text).join("") ||
                        "";

                    // Handle different block styles
                    switch (block.style) {
                        case "h1":
                            return (
                                <h1
                                    key={index}
                                    className="text-4xl font-bold mb-4 mt-8"
                                >
                                    {text}
                                </h1>
                            );
                        case "h2":
                            return (
                                <h2
                                    key={index}
                                    className="text-3xl font-bold mb-3 mt-6"
                                >
                                    {text}
                                </h2>
                            );
                        case "h3":
                            return (
                                <h3
                                    key={index}
                                    className="text-2xl font-semibold mb-2 mt-4"
                                >
                                    {text}
                                </h3>
                            );
                        case "h4":
                            return (
                                <h4
                                    key={index}
                                    className="text-xl font-semibold mb-2 mt-4"
                                >
                                    {text}
                                </h4>
                            );
                        case "blockquote":
                            return (
                                <blockquote
                                    key={index}
                                    className="border-l-4 border-primary pl-4 italic my-4"
                                >
                                    {text}
                                </blockquote>
                            );
                        default:
                            return (
                                <p key={index} className="mb-4 leading-relaxed">
                                    {text}
                                </p>
                            );
                    }
                }

                if (
                    block._type === "image" &&
                    "asset" in block &&
                    block.asset
                ) {
                    const imageBlock = block as SanityImageBlock;
                    const imageUrl = getImageUrlFromString(
                        imageBlock.asset.url
                    );
                    if (!imageUrl) return null;
                    return (
                        <img
                            key={index}
                            src={imageUrl}
                            alt={imageBlock.alt || ""}
                            className="w-full rounded-lg my-6"
                        />
                    );
                }

                return null;
            })}
        </div>
    );
};

const UpdateDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const [update, setUpdate] = useState<SanityUpdate | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUpdate = async () => {
            if (slug) {
                const data = await getUpdateBySlug(slug);
                setUpdate(data);
            }
            setLoading(false);
        };
        fetchUpdate();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navigation />
                <main className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!update) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navigation />
                <main id="main-content" className="flex-1">
                    <section className="bg-primary text-primary-foreground py-12 md:py-0 md:min-h-screen md:flex md:items-center">
                        <div className="container mx-auto px-4 w-full">
                            <div className="max-w-4xl md:mx-auto md:text-center">
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                                    Update Not Found
                                </h1>
                                <p className="text-lg md:text-xl max-w-3xl leading-relaxed opacity-90 md:mx-auto">
                                    The update you're looking for doesn't exist.
                                </p>
                            </div>
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />

            <main id="main-content" className="flex-1">
                <section 
                    className={`relative bg-primary text-primary-foreground py-12 md:py-0 md:min-h-screen md:flex md:items-center ${
                        update.image ? 'bg-cover bg-center' : ''
                    }`}
                    style={update.image ? {
                        backgroundImage: `url(${getImageUrl(update.image, {
                            width: 1920,
                            height: 1080,
                            format: "webp",
                        })})`
                    } : undefined}
                >
                    {/* Dark overlay */}
                    {update.image && (
                        <div className="absolute inset-0 bg-black/60"></div>
                    )}
                    
                    {/* Content */}
                    <div className="container mx-auto px-4 w-full relative z-10">
                        <div className="max-w-4xl md:mx-auto md:text-center">
                            {update.featured && (
                                <Badge className="mb-6 bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 md:mx-auto">
                                    Featured
                                </Badge>
                            )}
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                                {update.title}
                            </h1>
                            <div className="flex flex-wrap justify-center gap-4 text-lg md:text-xl opacity-90">
                                <div className="flex items-center gap-2">
                                    <Calendar
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                    />
                                    <span>
                                        {format(
                                            new Date(update.publishedAt),
                                            "PPP"
                                        )}
                                    </span>
                                </div>
                                {update.author && (
                                    <div className="flex items-center gap-2">
                                        <User
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        />
                                        <span>{update.author}</span>
                                    </div>
                                )}
                                {update.type && (
                                    <Badge
                                        variant="outline"
                                        className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 capitalize"
                                    >
                                        {update.type}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">

                            {update.excerpt && (
                                <p className="text-xl text-muted-foreground mb-8 leading-relaxed italic">
                                    {update.excerpt}
                                </p>
                            )}

                            {update.body && (
                                <PortableText blocks={update.body} />
                            )}

                            {update.tags && update.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-8">
                                    {update.tags.map(
                                        (tag: string, index: number) => (
                                            <Badge
                                                key={index}
                                                variant="outline"
                                            >
                                                {tag}
                                            </Badge>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default UpdateDetail;
