import { Badge } from "@/components/ui/badge";
import { PortableText } from "@/components/PortableText";
import type { SanityPortableTextBlock } from "@/lib/sanity.types";

interface PageContentProps {
  heading: string;
  subheading?: string;
  content?: SanityPortableTextBlock[];
  badgeText?: string;
}

export const PageContent = ({
  heading,
  subheading,
  content,
  badgeText,
}: PageContentProps) => {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-12 md:py-0 md:min-h-screen md:flex md:items-center">
        <div className="container mx-auto px-4 w-full">
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
              <PortableText blocks={content} className="space-y-6" />
            </div>
          </div>
        </section>
      )}
    </>
  );
};

