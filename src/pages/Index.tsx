import { lazy, Suspense } from "react";
import { Navigation } from "@/components/Navigation";
import { RedevelopmentBanner } from "@/components/RedevelopmentBanner";
import { HeroSection } from "@/components/HeroSection";

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
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "NGO",
        "name": "China Coast Community",
        "description": "A caring home for Hong Kong's English-speaking elderly since 1978. Supporting our redevelopment to create a safe, modern community where every senior is valued.",
        "foundingDate": "1978",
        "url": "https://www.chinacoastcommunity.org.hk",
        "logo": "https://www.chinacoastcommunity.org.hk/ccc-logo.svg",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "HK",
            "addressLocality": "Hong Kong"
        },
        "sameAs": []
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
