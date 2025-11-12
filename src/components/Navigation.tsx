import { Heart, Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { Logo } from "./Logo";

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Logo size="md" showText={true} asLink={true} />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* About Dropdown */}
            <div className="relative group">
              <button className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1">
                About
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 pt-1 w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none group-hover:pointer-events-auto">
                <div className="rounded-md border bg-popover p-2 shadow-lg">
                  <Link
                    to="/about"
                    className="block rounded-md p-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    About
                  </Link>
                  <Link
                    to="/future"
                    className="block rounded-md p-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Future Plans
                  </Link>
                </div>
              </div>
            </div>

            {/* Get Involved Dropdown */}
            <div className="relative group">
              <button className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1">
                Get Involved
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 pt-1 w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none group-hover:pointer-events-auto">
                <div className="rounded-md border bg-popover p-2 shadow-lg">
                  <Link
                    to="/community"
                    className="block rounded-md p-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Community
                  </Link>
                  <Link
                    to="/waitlist"
                    className="block rounded-md p-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Join Waitlist
                  </Link>
                  <Link
                    to="/volunteer"
                    className="block rounded-md p-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Volunteer
                  </Link>
                </div>
              </div>
            </div>

            {/* Support Dropdown */}
            <div className="relative group">
              <button className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1">
                Support
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 pt-1 w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none group-hover:pointer-events-auto">
                <div className="rounded-md border bg-popover p-2 shadow-lg">
                  <Link
                    to="/support/donate"
                    className="block rounded-md p-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Donate
                  </Link>
                  <Link
                    to="/reports"
                    className="block rounded-md p-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Annual Reports
                  </Link>
                </div>
              </div>
            </div>

            {/* News Dropdown */}
            <div className="relative group">
              <button className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1">
                News
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 pt-1 w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none group-hover:pointer-events-auto">
                <div className="rounded-md border bg-popover p-2 shadow-lg">
                  <Link
                    to="/updates"
                    className="block rounded-md p-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Updates
                  </Link>
                  <Link
                    to="/events"
                    className="block rounded-md p-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Events
                  </Link>
                </div>
              </div>
            </div>

            {/* Contact Link */}
            <Link to="/contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-3">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link 
                    to="/" 
                    className="text-base font-medium text-foreground hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-muted-foreground">About</span>
                    <Link 
                      to="/about" 
                      className="text-sm text-foreground hover:text-primary transition-colors pl-4"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      About
                    </Link>
                    <Link 
                      to="/future" 
                      className="text-sm text-foreground hover:text-primary transition-colors pl-4"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Future Plans
                    </Link>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-muted-foreground">Get Involved</span>
                    <Link 
                      to="/community" 
                      className="text-sm text-foreground hover:text-primary transition-colors pl-4"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Community
                    </Link>
                    <Link 
                      to="/waitlist" 
                      className="text-sm text-foreground hover:text-primary transition-colors pl-4"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Join Waitlist
                    </Link>
                    <Link 
                      to="/volunteer" 
                      className="text-sm text-foreground hover:text-primary transition-colors pl-4"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Volunteer
                    </Link>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-muted-foreground">Support</span>
                    <Link 
                      to="/support/donate" 
                      className="text-sm text-foreground hover:text-primary transition-colors pl-4"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Donate
                    </Link>
                    <Link 
                      to="/reports" 
                      className="text-sm text-foreground hover:text-primary transition-colors pl-4"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Annual Reports
                    </Link>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-muted-foreground">News</span>
                    <Link 
                      to="/updates" 
                      className="text-sm text-foreground hover:text-primary transition-colors pl-4"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Updates
                    </Link>
                    <Link 
                      to="/events" 
                      className="text-sm text-foreground hover:text-primary transition-colors pl-4"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Events
                    </Link>
                  </div>

                  <Link 
                    to="/contact" 
                    className="text-base font-medium text-foreground hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>

            <Button variant="success" size="sm" className="gap-1" asChild>
              <Link to="/support/donate">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Donate Now</span>
              </Link>
            </Button>
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="success" size="sm" className="gap-1" asChild>
              <Link to="/support/donate">
                <Heart className="h-4 w-4" />
                Donate Now
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};
