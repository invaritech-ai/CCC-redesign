import { Link } from "react-router-dom";
import { Building2, ArrowRight } from "lucide-react";

/**
 * Redevelopment Banner Component
 * 
 * Displays a prominent banner informing visitors about the ongoing redevelopment.
 * Positioned below navigation to ensure immediate visibility.
 * 
 * Features:
 * - Full-width banner with subtle but clear styling
 * - Icon for visual emphasis
 * - Link to redevelopment page
 * - Mobile-responsive design
 * - Accessible (ARIA labels, proper contrast)
 */
export const RedevelopmentBanner = () => {
  return (
    <div
      role="region"
      aria-label="Redevelopment notice"
      className="w-full bg-secondary/40 border-b border-border/50"
    >
      <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3 sm:gap-4">
          {/* Icon and Text */}
          <div className="flex items-center justify-center sm:justify-start gap-3 flex-1">
            <Building2 
              className="h-5 w-5 sm:h-6 sm:w-6 text-foreground flex-shrink-0" 
              aria-hidden="true"
            />
            <p className="text-base sm:text-lg font-medium text-foreground text-center sm:text-left">
              <span className="font-semibold">Currently Closed for Redevelopment</span>
              {" "}
              <span className="text-muted-foreground">
                — We're building a modern, safe home to reopen stronger
              </span>
            </p>
          </div>

          {/* Link */}
          <div className="flex items-center justify-center sm:justify-end">
            <Link
              to="/redevelopment"
              className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-primary hover:text-primary/80 underline underline-offset-2 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded px-2 py-1"
              aria-label="Learn more about our redevelopment project"
            >
              Learn More
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

