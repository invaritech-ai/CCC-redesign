import { Badge } from "@/components/ui/badge";
import { PortableText } from "@/components/PortableText";
import type {
    SanityPortableTextBlock,
    SanityPageContent,
} from "@/lib/sanity.types";
import { getImageUrl } from "@/lib/sanityImage";
import { cn } from "@/lib/utils";

interface PageContentProps {
    heading: string;
    subheading?: string;
    content?: SanityPortableTextBlock[];
    badgeText?: string;
    heroImage?: SanityPageContent["heroImage"];
    bottomImages?: SanityPageContent["bottomImages"];
    pageSlug?: string;
}

export const PageContent = ({
    heading,
    subheading,
    content,
    badgeText,
    heroImage,
    bottomImages,
    pageSlug,
}: PageContentProps) => {
    const isMajorDonorsPage = pageSlug === "donate/major-donors";

    const heroImageUrl = heroImage
        ? getImageUrl(heroImage, { width: 1920, quality: 90 })
        : null;

    return (
        <>
            {/* Hero Section */}
            <section
                className={`${
                    heroImageUrl ? "relative" : "bg-primary"
                } text-primary-foreground py-12 md:py-0 md:min-h-screen md:flex md:items-center`}
                style={
                    heroImageUrl
                        ? {
                              backgroundImage: `url(${heroImageUrl})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                          }
                        : undefined
                }
            >
                {heroImageUrl && (
                    <div className="absolute inset-0 bg-black/40" />
                )}
                <div className="container mx-auto px-4 w-full relative z-10">
                    <div className="max-w-4xl md:mx-auto md:text-center">
                        {badgeText && (
                            <Badge className="mb-6 bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 md:mx-auto">
                                {badgeText}
                            </Badge>
                        )}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                            {heading}
                        </h1>
                        {subheading && (
                            <p className="text-lg md:text-xl max-w-3xl leading-relaxed opacity-90 md:mx-auto">
                                {subheading}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Content Section */}
            {content && content.length > 0 && (
                <section className="py-12 md:py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <PortableText
                                blocks={content}
                                className={cn(
                                    "space-y-6",
                                    isMajorDonorsPage &&
                                        "md:[&>ul]:grid md:[&>ul]:grid-cols-2 md:[&>ul]:gap-x-16 md:[&>ul]:gap-y-2"
                                )}
                            />
                        </div>
                    </div>
                </section>
            )}

            {/* Bottom Images Section */}
            {bottomImages && bottomImages.length > 0 && (
                <section className="py-12 md:py-20 bg-secondary/20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {bottomImages.map((item, index) => {
                                    const imageUrl = item.image
                                        ? getImageUrl(item.image, {
                                              width: 800,
                                              quality: 85,
                                          })
                                        : null;
                                    if (!imageUrl) return null;

                                    return (
                                        <div
                                            key={index}
                                            className="relative overflow-hidden rounded-lg aspect-video bg-secondary"
                                        >
                                            <img
                                                src={imageUrl}
                                                alt={
                                                    item.alt ||
                                                    `Image ${index + 1}`
                                                }
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
};
