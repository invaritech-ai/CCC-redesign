import { Link, useLocation } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { applySeo, getCanonicalUrl } from "@/lib/seo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    applySeo({
      title: "Page Not Found | China Coast Community",
      description: "The page you are looking for could not be found.",
      url: getCanonicalUrl(location.pathname),
      robots: "noindex, nofollow",
    });

    return () => applySeo();
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 flex items-center justify-center bg-secondary/30">
        <div className="text-center">
          <h1 className="mb-4 text-4xl md:text-6xl font-bold">404</h1>
          <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
          <p className="mb-8 text-sm text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
