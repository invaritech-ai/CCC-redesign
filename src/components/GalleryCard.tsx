import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import { getImageUrl } from "@/lib/sanityImage";
import type { SanityGallery } from "@/lib/sanity.types";

interface GalleryCardProps {
    gallery: SanityGallery;
}

export const GalleryCard = ({ gallery }: GalleryCardProps) => {
    const firstImage = gallery.images && gallery.images.length > 0 ? gallery.images[0] : null;
    const thumbnailUrl = firstImage?.image
        ? getImageUrl(firstImage.image, {
              width: 800,
              height: 600,
              format: "webp",
          })
        : null;

    const gallerySlug = gallery.slug?.current;
    const linkPath = gallerySlug
        ? `/news/media-and-press/galleries/${gallerySlug}`
        : "#";

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            {thumbnailUrl ? (
                <img
                    src={thumbnailUrl}
                    alt={firstImage?.alt || gallery.title}
                    className="w-full h-48 object-cover"
                    width="800"
                    height="600"
                />
            ) : (
                <div className="w-full h-48 bg-muted flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                </div>
            )}
            <div className="p-4">
                <h2 className="text-lg font-semibold mb-2 leading-tight line-clamp-2">
                    {gallery.title}
                </h2>
                {gallery.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {gallery.description}
                    </p>
                )}
                {gallerySlug && (
                    <Link
                        to={linkPath}
                        className="inline-flex items-center text-primary hover:underline text-base font-semibold"
                    >
                        View gallery{" "}
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






