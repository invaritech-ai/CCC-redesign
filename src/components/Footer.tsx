import { Heart, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DonateNowButton } from "./DonateNowButton";

export const Footer = () => {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* CTAs Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Get Involved</h3>
            <div className="space-y-3">
              <DonateNowButton size="sm" />
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link to="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>

          {/* Subscribe Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to receive the latest news and updates about our redevelopment progress
            </p>
            <form className="flex gap-2" onSubmit={(e) => {
              e.preventDefault();
              // TODO: Connect to email subscription service
            }}>
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1"
                required
              />
              <Button type="submit" variant="success" size="sm">
                <Mail className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Links Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/reports" className="text-muted-foreground hover:text-primary transition-colors">
                Annual Reports
              </Link>
              <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <Heart className="h-4 w-4 text-primary-foreground fill-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">China Coast Community</span>
          </div>
          
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} China Coast Community. Caring for Hong Kong's English-speaking elderly since 1978.
          </p>
        </div>
      </div>
    </footer>
  );
};
