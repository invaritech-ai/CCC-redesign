import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CookieBanner } from "@/components/CookieBanner";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ScrollToTop } from "@/components/ScrollToTop";

// Keep Index synchronous for fastest initial load
import Index from "./pages/Index";

// Lazy load all other routes for code splitting
const About = lazy(() => import("./pages/About"));
const Future = lazy(() => import("./pages/Future"));
const Contact = lazy(() => import("./pages/Contact"));
const Community = lazy(() => import("./pages/Community"));
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
const CMSPage = lazy(() => import("./pages/CMSPage"));
const BoardGovernance = lazy(() => import("./pages/BoardGovernance"));
const FAQ = lazy(() => import("./pages/FAQ"));
const MediaAndPress = lazy(() => import("./pages/MediaAndPress"));
const GalleryDetail = lazy(() => import("./pages/GalleryDetail"));
const PressReleaseDetail = lazy(() => import("./pages/PressReleaseDetail"));

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
                <ScrollToTop />
                {/* Skip to main content link for keyboard users */}
                <a
                    href="#main-content"
                    className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-primary focus:text-primary-foreground focus:rounded-br-md focus:outline-none focus:ring-2 focus:ring-ring"
                >
                    Skip to main content
                </a>
                <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                        {/* Static Routes */}
                        <Route path="/" element={<Index />} />
                        <Route path="/who-we-are/about" element={<About />} />
                        <Route path="/redevelopment" element={<Future />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route
                            path="/care-community/community-members-programme"
                            element={<Community />}
                        />
                        <Route
                            path="/get-involved/volunteer"
                            element={<Volunteer />}
                        />
                        <Route path="/donate" element={<SupportDonate />} />
                        <Route
                            path="/donate/major-donors"
                            element={<CMSPage slug="donate/major-donors" />}
                        />
                        <Route
                            path="/support/confirmation"
                            element={<SupportConfirmation />}
                        />
                        <Route
                            path="/support/payment-failed"
                            element={<SupportPaymentFailed />}
                        />
                        <Route
                            path="/who-we-are/publications/annual-reports"
                            element={<Reports />}
                        />
                        {/* Shorter route alias for reports listing */}
                        <Route path="/reports" element={<Reports />} />
                        <Route
                            path="/news"
                            element={
                                <Updates
                                    defaultType="news"
                                    title="Latest News"
                                    pageSlug="news"
                                />
                            }
                        />
                        <Route
                            path="/care-community/activities-and-events"
                            element={<Events />}
                        />
                        <Route path="/privacy" element={<Privacy />} />

                        {/* CMS Pages */}
                        <Route
                            path="/who-we-are/history"
                            element={<CMSPage slug="who-we-are/history" />}
                        />
                        <Route
                            path="/who-we-are/mission-values"
                            element={
                                <CMSPage slug="who-we-are/mission-values" />
                            }
                        />
                        <Route
                            path="/who-we-are/board-governance"
                            element={<BoardGovernance />}
                        />
                        <Route
                            path="/who-we-are/team"
                            element={<CMSPage slug="team" />}
                        />
                        <Route
                            path="/care-community/life-at-ccc"
                            element={
                                <CMSPage slug="care-community/life-at-ccc" />
                            }
                        />
                        <Route
                            path="/care-community/care-and-attention-home"
                            element={
                                <CMSPage slug="care-community/care-and-attention-home" />
                            }
                        />
                        <Route path="/care-community/faqs" element={<FAQ />} />
                        <Route
                            path="/news/noticeboard"
                            element={
                                <Updates
                                    defaultType={["announcement", "initiative"]}
                                    title="Noticeboard"
                                    pageSlug="news/noticeboard"
                                />
                            }
                        />
                        <Route
                            path="/news/stories"
                            element={
                                <Updates 
                                    defaultType="story" 
                                    title="Stories"
                                    pageSlug="news/stories"
                                />
                            }
                        />
                        <Route
                            path="/news/blog"
                            element={
                                <Updates 
                                    defaultType="article" 
                                    title="Blog"
                                    pageSlug="news/blog"
                                />
                            }
                        />
                        <Route
                            path="/news/media-and-press"
                            element={<MediaAndPress />}
                        />

                        {/* Legacy Redirects (Optional - handled by 404 or manual redirect if needed, but for now just new structure) */}

                        {/* Dynamic Routes */}
                        <Route path="/news/stories/:slug" element={<UpdateDetail />} />
                        <Route path="/news/:slug" element={<UpdateDetail />} />
                        <Route
                            path="/care-community/activities-and-events/:slug"
                            element={<EventDetail />}
                        />
                        <Route
                            path="/who-we-are/publications/annual-reports/:slug"
                            element={<ReportDetail />}
                        />
                        {/* Shorter route alias for reports */}
                        <Route
                            path="/reports/:slug"
                            element={<ReportDetail />}
                        />
                        <Route
                            path="/news/media-and-press/galleries/:slug"
                            element={<GalleryDetail />}
                        />
                        <Route
                            path="/news/media-and-press/press-releases/:slug"
                            element={<PressReleaseDetail />}
                        />

                        {/* 404 Route */}
                        <Route path="/404" element={<NotFound />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Suspense>
                {/* Cookie Information Banner - appears on all pages */}
                <CookieBanner />
                {/* Floating WhatsApp Button - appears on all pages */}
                <WhatsAppButton
                    variant="floating"
                    size="default"
                    showText={false}
                />
            </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
