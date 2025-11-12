import { lazy, Suspense } from "react";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";

// Lazy load below-the-fold sections
const StatsSection = lazy(() => import("@/components/StatsSection").then(m => ({ default: m.StatsSection })));
const NoticeboardSection = lazy(() => import("@/components/NoticeboardSection").then(m => ({ default: m.NoticeboardSection })));
const ServicesSection = lazy(() => import("@/components/ServicesSection").then(m => ({ default: m.ServicesSection })));
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection").then(m => ({ default: m.TestimonialsSection })));
const CTASection = lazy(() => import("@/components/CTASection").then(m => ({ default: m.CTASection })));
const Footer = lazy(() => import("@/components/Footer").then(m => ({ default: m.Footer })));

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <HeroSection />
        <Suspense fallback={null}>
          <StatsSection />
          <NoticeboardSection />
          <ServicesSection />
          <TestimonialsSection />
          <CTASection />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
