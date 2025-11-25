import { Link } from "react-router-dom";
import { DonateNowButton } from "./DonateNowButton";
import { Logo } from "./Logo";
import { FaFacebook, FaWhatsapp } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8 md:px-24 lg:px-32 xl:px-40">
          {/* CTAs Column */}
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-lg font-semibold text-foreground mb-4">Get Involved</h3>
            <div className="space-y-3 flex flex-col items-center md:items-start gap-3">
              <DonateNowButton size="sm" />
            </div>
          </div>

          {/* Links Column */}
          <div className="space-y-4 text-center md:text-right">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2 text-sm items-center md:items-end">
              <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/who-we-are/publications/annual-reports" className="text-muted-foreground hover:text-primary transition-colors">
                Annual Reports
              </Link>
              <Link to="/who-we-are/about" className="text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Connect With Us Column */}
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-lg font-semibold text-foreground mb-4">Connect With Us</h3>
            <div className="flex flex-col gap-2 text-sm items-center md:items-start">
              <a
                href="https://wa.me/85261104078"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <FaWhatsapp className="h-4 w-4" aria-hidden="true" />
                <span>WhatsApp</span>
              </a>
              <a
                href="https://zh-hk.facebook.com/chinacoastcommunity/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <FaFacebook className="h-4 w-4" aria-hidden="true" />
                <span>Facebook</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-center gap-4 pt-8 border-t">
          <Logo size="sm" showText={true} asLink={false} />
          
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} China Coast Community.
          </p>
        </div>
      </div>
    </footer>
  );
};
