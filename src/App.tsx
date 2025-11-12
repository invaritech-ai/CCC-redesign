import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Future from "./pages/Future";
import Contact from "./pages/Contact";
import Community from "./pages/Community";
import Waitlist from "./pages/Waitlist";
import Volunteer from "./pages/Volunteer";
import SupportDonate from "./pages/SupportDonate";
import SupportConfirmation from "./pages/SupportConfirmation";
import SupportPaymentFailed from "./pages/SupportPaymentFailed";
import Reports from "./pages/Reports";
import ReportDetail from "./pages/ReportDetail";
import Updates from "./pages/Updates";
import UpdateDetail from "./pages/UpdateDetail";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
