import { Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useRef, useEffect } from "react";
import { Logo } from "./Logo";
import { DonateNowButton } from "./DonateNowButton";

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  // Refs for dropdown containers to handle outside clicks
  const aboutRef = useRef<HTMLDivElement>(null);
  const getInvolvedRef = useRef<HTMLDivElement>(null);
  const supportRef = useRef<HTMLDivElement>(null);
  const newsRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        aboutRef.current && !aboutRef.current.contains(event.target as Node) &&
        getInvolvedRef.current && !getInvolvedRef.current.contains(event.target as Node) &&
        supportRef.current && !supportRef.current.contains(event.target as Node) &&
        newsRef.current && !newsRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [openDropdown]);

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleDropdownKeyDown = (
    e: React.KeyboardEvent,
    dropdown: string,
    links: Array<{ to: string; text: string }>
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleDropdown(dropdown);
    } else if (e.key === "Escape") {
      setOpenDropdown(null);
      (e.currentTarget as HTMLElement).focus();
    } else if (e.key === "ArrowDown" && openDropdown === dropdown) {
      e.preventDefault();
      const firstLink = e.currentTarget.parentElement?.querySelector("a");
      firstLink?.focus();
    }
  };

  const handleMenuKeyDown = (e: React.KeyboardEvent, links: Array<{ to: string; text: string }>, index: number) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextLink = e.currentTarget.parentElement?.querySelectorAll("a")[index + 1];
      nextLink?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (index === 0) {
        const button = e.currentTarget.closest(".relative")?.querySelector("button");
        button?.focus();
      } else {
        const prevLink = e.currentTarget.parentElement?.querySelectorAll("a")[index - 1];
        prevLink?.focus();
      }
    } else if (e.key === "Escape") {
      setOpenDropdown(null);
      const button = e.currentTarget.closest(".relative")?.querySelector("button");
      button?.focus();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Logo size="md" showText={true} asLink={true} />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* About Dropdown */}
            <div 
              className="relative group"
              ref={aboutRef}
              onMouseEnter={() => setOpenDropdown("about")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1 py-2 min-h-[44px]"
                aria-expanded={openDropdown === "about"}
                aria-haspopup="menu"
                aria-label="About menu"
                onClick={() => toggleDropdown("about")}
                onKeyDown={(e) => handleDropdownKeyDown(e, "about", [
                  { to: "/about", text: "About" },
                  { to: "/future", text: "Future Plans" }
                ])}
                onFocus={() => setOpenDropdown("about")}
              >
                About
                <ChevronDown 
                  className={`h-4 w-4 transition-transform ${openDropdown === "about" ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              <div 
                className={`absolute top-full left-0 pt-1 w-[200px] transition-all duration-200 z-50 ${
                  openDropdown === "about" 
                    ? "opacity-100 visible pointer-events-auto" 
                    : "opacity-0 invisible pointer-events-none"
                }`}
                role="menu"
                aria-label="About submenu"
              >
                <div className="rounded-md border bg-popover p-2 shadow-lg">
                  <Link
                    to="/about"
                    role="menuitem"
                    className="block rounded-md p-3 text-sm font-medium hover:bg-[hsl(var(--muted-foreground))] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                    onKeyDown={(e) => handleMenuKeyDown(e, [
                      { to: "/about", text: "About" },
                      { to: "/future", text: "Future Plans" }
                    ], 0)}
                  >
                    About
                  </Link>
                  <Link
                    to="/future"
                    role="menuitem"
                    className="block rounded-md p-3 text-sm font-medium hover:bg-[hsl(var(--muted-foreground))] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                    onKeyDown={(e) => handleMenuKeyDown(e, [
                      { to: "/about", text: "About" },
                      { to: "/future", text: "Future Plans" }
                    ], 1)}
                  >
                    Future Plans
                  </Link>
                </div>
              </div>
            </div>

            {/* Get Involved Dropdown */}
            <div 
              className="relative group"
              ref={getInvolvedRef}
              onMouseEnter={() => setOpenDropdown("getInvolved")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1 py-2 min-h-[44px]"
                aria-expanded={openDropdown === "getInvolved"}
                aria-haspopup="menu"
                aria-label="Get Involved menu"
                onClick={() => toggleDropdown("getInvolved")}
                onKeyDown={(e) => handleDropdownKeyDown(e, "getInvolved", [
                  { to: "/community", text: "Community" },
                  { to: "/waitlist", text: "Join Waitlist" },
                  { to: "/volunteer", text: "Volunteer" }
                ])}
                onFocus={() => setOpenDropdown("getInvolved")}
              >
                Get Involved
                <ChevronDown 
                  className={`h-4 w-4 transition-transform ${openDropdown === "getInvolved" ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              <div 
                className={`absolute top-full left-0 pt-1 w-[200px] transition-all duration-200 z-50 ${
                  openDropdown === "getInvolved" 
                    ? "opacity-100 visible pointer-events-auto" 
                    : "opacity-0 invisible pointer-events-none"
                }`}
                role="menu"
                aria-label="Get Involved submenu"
              >
                <div className="rounded-md border bg-popover p-2 shadow-lg">
                  <Link
                    to="/community"
                    role="menuitem"
                    className="block rounded-md p-3 text-sm font-medium hover:bg-[hsl(var(--muted-foreground))] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                    onKeyDown={(e) => handleMenuKeyDown(e, [
                      { to: "/community", text: "Community" },
                      { to: "/waitlist", text: "Join Waitlist" },
                      { to: "/volunteer", text: "Volunteer" }
                    ], 0)}
                  >
                    Community
                  </Link>
                  <Link
                    to="/waitlist"
                    role="menuitem"
                    className="block rounded-md p-3 text-sm font-medium hover:bg-[hsl(var(--muted-foreground))] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                    onKeyDown={(e) => handleMenuKeyDown(e, [
                      { to: "/community", text: "Community" },
                      { to: "/waitlist", text: "Join Waitlist" },
                      { to: "/volunteer", text: "Volunteer" }
                    ], 1)}
                  >
                    Join Waitlist
                  </Link>
                  <Link
                    to="/volunteer"
                    role="menuitem"
                    className="block rounded-md p-3 text-sm font-medium hover:bg-[hsl(var(--muted-foreground))] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                    onKeyDown={(e) => handleMenuKeyDown(e, [
                      { to: "/community", text: "Community" },
                      { to: "/waitlist", text: "Join Waitlist" },
                      { to: "/volunteer", text: "Volunteer" }
                    ], 2)}
                  >
                    Volunteer
                  </Link>
                </div>
              </div>
            </div>

            {/* Support Dropdown */}
            <div 
              className="relative group"
              ref={supportRef}
              onMouseEnter={() => setOpenDropdown("support")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1 py-2 min-h-[44px]"
                aria-expanded={openDropdown === "support"}
                aria-haspopup="menu"
                aria-label="Support menu"
                onClick={() => toggleDropdown("support")}
                onKeyDown={(e) => handleDropdownKeyDown(e, "support", [
                  { to: "/support/donate", text: "Donate" },
                  { to: "/reports", text: "Annual Reports" }
                ])}
                onFocus={() => setOpenDropdown("support")}
              >
                Support
                <ChevronDown 
                  className={`h-4 w-4 transition-transform ${openDropdown === "support" ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              <div 
                className={`absolute top-full left-0 pt-1 w-[200px] transition-all duration-200 z-50 ${
                  openDropdown === "support" 
                    ? "opacity-100 visible pointer-events-auto" 
                    : "opacity-0 invisible pointer-events-none"
                }`}
                role="menu"
                aria-label="Support submenu"
              >
                <div className="rounded-md border bg-popover p-2 shadow-lg">
                  <Link
                    to="/support/donate"
                    role="menuitem"
                    className="block rounded-md p-3 text-sm font-medium hover:bg-[hsl(var(--muted-foreground))] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                    onKeyDown={(e) => handleMenuKeyDown(e, [
                      { to: "/support/donate", text: "Donate" },
                      { to: "/reports", text: "Annual Reports" }
                    ], 0)}
                  >
                    Donate
                  </Link>
                  <Link
                    to="/reports"
                    role="menuitem"
                    className="block rounded-md p-3 text-sm font-medium hover:bg-[hsl(var(--muted-foreground))] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                    onKeyDown={(e) => handleMenuKeyDown(e, [
                      { to: "/support/donate", text: "Donate" },
                      { to: "/reports", text: "Annual Reports" }
                    ], 1)}
                  >
                    Annual Reports
                  </Link>
                </div>
              </div>
            </div>

            {/* News Dropdown */}
            <div 
              className="relative group"
              ref={newsRef}
              onMouseEnter={() => setOpenDropdown("news")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1 py-2 min-h-[44px]"
                aria-expanded={openDropdown === "news"}
                aria-haspopup="menu"
                aria-label="News menu"
                onClick={() => toggleDropdown("news")}
                onKeyDown={(e) => handleDropdownKeyDown(e, "news", [
                  { to: "/updates", text: "Updates" },
                  { to: "/events", text: "Events" }
                ])}
                onFocus={() => setOpenDropdown("news")}
              >
                News
                <ChevronDown 
                  className={`h-4 w-4 transition-transform ${openDropdown === "news" ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              <div 
                className={`absolute top-full left-0 pt-1 w-[200px] transition-all duration-200 z-50 ${
                  openDropdown === "news" 
                    ? "opacity-100 visible pointer-events-auto" 
                    : "opacity-0 invisible pointer-events-none"
                }`}
                role="menu"
                aria-label="News submenu"
              >
                <div className="rounded-md border bg-popover p-2 shadow-lg">
                  <Link
                    to="/updates"
                    role="menuitem"
                    className="block rounded-md p-3 text-sm font-medium hover:bg-[hsl(var(--muted-foreground))] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                    onKeyDown={(e) => handleMenuKeyDown(e, [
                      { to: "/updates", text: "Updates" },
                      { to: "/events", text: "Events" }
                    ], 0)}
                  >
                    Updates
                  </Link>
                  <Link
                    to="/events"
                    role="menuitem"
                    className="block rounded-md p-3 text-sm font-medium hover:bg-[hsl(var(--muted-foreground))] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                    onKeyDown={(e) => handleMenuKeyDown(e, [
                      { to: "/updates", text: "Updates" },
                      { to: "/events", text: "Events" }
                    ], 1)}
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
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="min-h-[44px] min-w-[44px]"
                  aria-label="Toggle navigation menu"
                  aria-expanded={mobileMenuOpen}
                >
                  <Menu className="h-5 w-5" aria-hidden="true" />
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

            <DonateNowButton size="sm" />
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <DonateNowButton size="sm" />
          </div>
        </nav>
      </div>
    </header>
  );
};
