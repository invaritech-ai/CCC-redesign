import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Keep Index synchronous for fastest initial load
import Index from "./pages/Index";

// Lazy load all other routes for code splitting
const About = lazy(() => import("./pages/About"));
const Future = lazy(() => import("./pages/Future"));
const Contact = lazy(() => import("./pages/Contact"));
const Community = lazy(() => import("./pages/Community"));
const Waitlist = lazy(() => import("./pages/Waitlist"));
const Volunteer = lazy(() => import("./pages/Volunteer"));
const SupportDonate = lazy(() => import("./pages/SupportDonate"));
const SupportConfirmation = lazy(() => import("./pages/SupportConfirmation"));
const SupportPaymentFailed = lazy(() => import("./pages/SupportPaymentFailed"));
const Reports = lazy(() => import("./pages/Reports"));
const ReportDetail = lazy(() => import("./pages/ReportDetail"));
const Updates = lazy(() => import("./pages/Updates"));
const UpdateDetail = lazy(() => import("./pages/UpdateDetail"));
const Events = lazy(() => import("./pages/Events"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const Privacy = lazy(() => import("./pages/Privacy"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Static Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/future" element={<Future />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/community" element={<Community />} />
            <Route path="/waitlist" element={<Waitlist />} />
            <Route path="/volunteer" element={<Volunteer />} />
            <Route path="/support/donate" element={<SupportDonate />} />
            <Route path="/support/confirmation" element={<SupportConfirmation />} />
            <Route path="/support/payment-failed" element={<SupportPaymentFailed />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/updates" element={<Updates />} />
            <Route path="/events" element={<Events />} />
            <Route path="/privacy" element={<Privacy />} />
            
            {/* Dynamic Routes */}
            <Route path="/updates/:slug" element={<UpdateDetail />} />
            <Route path="/events/:slug" element={<EventDetail />} />
            <Route path="/reports/:slug" element={<ReportDetail />} />
            
            {/* 404 Route */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
