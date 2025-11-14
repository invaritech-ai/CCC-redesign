import { lazy, Suspense } from "react";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";

// Lazy load below-the-fold sections
const KeyHighlightsSection = lazy(() => import("@/components/KeyHighlightsSection").then(m => ({ default: m.KeyHighlightsSection })));
const StatsSection = lazy(() => import("@/components/StatsSection").then(m => ({ default: m.StatsSection })));
const FeaturedStorySection = lazy(() => import("@/components/FeaturedStorySection").then(m => ({ default: m.FeaturedStorySection })));
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection").then(m => ({ default: m.TestimonialsSection })));
const NoticeboardSection = lazy(() => import("@/components/NoticeboardSection").then(m => ({ default: m.NoticeboardSection })));
const TrustSignalsSection = lazy(() => import("@/components/TrustSignalsSection").then(m => ({ default: m.TrustSignalsSection })));
const ServicesSection = lazy(() => import("@/components/ServicesSection").then(m => ({ default: m.ServicesSection })));
const CTASection = lazy(() => import("@/components/CTASection").then(m => ({ default: m.CTASection })));
const Footer = lazy(() => import("@/components/Footer").then(m => ({ default: m.Footer })));

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        {/* 1. Hero Section with both CTAs */}
        <HeroSection />
        
        <Suspense fallback={null}>
          {/* 2. Key Highlights - 4 cards */}
          <KeyHighlightsSection />
          
          {/* 3. Impact Snapshot - Metrics */}
          <StatsSection />
          
          {/* 4. Featured Story - Prominent beneficiary/volunteer spotlight */}
          <FeaturedStorySection />
          
          {/* 5. Additional Testimonials */}
          <TestimonialsSection />
          
          {/* 6. Upcoming Events + Recent Update */}
          <NoticeboardSection />
          
          {/* 7. Trust Signals - Partner logos, accreditations, transparency */}
          <TrustSignalsSection />
          
          {/* 8. Services - Unified design */}
          <ServicesSection />
          
          {/* 9. CTA Section */}
          <CTASection />
        </Suspense>
      </main>
      
      {/* 10. Footer with CTAs */}
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
