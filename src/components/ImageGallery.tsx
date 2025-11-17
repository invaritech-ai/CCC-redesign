import { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
  }>;
  title?: string;
}

export const ImageGallery = ({ images, title }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">{title}</h2>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className="group relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label={`View ${image.alt} in full size`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading={index < 3 ? "eager" : "lazy"}
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-5xl w-full p-0 bg-black/95 border-none [&>button]:hidden">
          {selectedImage !== null && (
            <div className="relative">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Close image viewer"
              >
                <X className="h-6 w-6" />
              </button>
              <img
                src={images[selectedImage].src}
                alt={images[selectedImage].alt}
                className="w-full h-auto max-h-[90vh] object-contain"
              />
              {images[selectedImage].alt && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 text-center">
                  <p className="text-sm md:text-base">{images[selectedImage].alt}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

