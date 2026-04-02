import { lazy, Suspense, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { RedevelopmentBanner } from "@/components/RedevelopmentBanner";
import { HeroSection } from "@/components/HeroSection";
import {
    applySeo,
    DEFAULT_OG_IMAGE_URL,
    DEFAULT_OG_LOGO_URL,
    DEFAULT_SITE_DESCRIPTION,
    DEFAULT_SITE_URL,
} from "@/lib/seo";

// Lazy load below-the-fold sections
const KeyHighlightsSection = lazy(() =>
    import("@/components/KeyHighlightsSection").then((m) => ({
        default: m.KeyHighlightsSection,
    }))
);
const StatsSection = lazy(() =>
    import("@/components/StatsSection").then((m) => ({
        default: m.StatsSection,
    }))
);
const TestimonialsSection = lazy(() =>
    import("@/components/TestimonialsSection").then((m) => ({
        default: m.TestimonialsSection,
    }))
);
const ServicesSection = lazy(() =>
    import("@/components/ServicesSection").then((m) => ({
        default: m.ServicesSection,
    }))
);
const CTASection = lazy(() =>
    import("@/components/CTASection").then((m) => ({ default: m.CTASection }))
);
const Footer = lazy(() =>
    import("@/components/Footer").then((m) => ({ default: m.Footer }))
);

const Index = () => {
    useEffect(() => {
        applySeo();
    }, []);

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "NGO",
        "name": "China Coast Community",
        "description": DEFAULT_SITE_DESCRIPTION,
        "foundingDate": "1978",
        "url": DEFAULT_SITE_URL,
        "logo": DEFAULT_OG_LOGO_URL,
        "image": DEFAULT_OG_IMAGE_URL,
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "HK",
            "addressLocality": "Hong Kong"
        },
        "sameAs": ["https://zh-hk.facebook.com/chinacoastcommunity/"]
    };

    return (
        <div className="min-h-screen flex flex-col">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <Navigation />
            <RedevelopmentBanner />
            <main id="main-content" className="flex-1">
                {/* 1. Hero Section with both CTAs */}
                <HeroSection />

                <Suspense fallback={null}>
                    {/* 2. Key Highlights - 4 cards */}
                    <KeyHighlightsSection />

                    {/* 3. Impact Snapshot - Metrics */}
                    <StatsSection />

                    {/* 4. Additional Testimonials */}
                    <TestimonialsSection />

                    {/* 5. Services - Unified design */}
                    <ServicesSection />

                    {/* 6. CTA Section */}
                    <CTASection />
                </Suspense>
            </main>

            {/* 7. Footer with CTAs */}
            <Suspense fallback={null}>
                <Footer />
            </Suspense>
        </div>
    );
};

export default Index;
