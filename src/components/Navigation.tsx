import { Menu, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useState, useEffect } from "react";
import { Logo } from "./Logo";
import { DonateNowButton } from "./DonateNowButton";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href?: string;
  children?: NavItem[];
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Who We Are",
    children: [
      { label: "About China Coast Community", href: "/who-we-are/about" },
      { label: "Our History", href: "/who-we-are/history" },
      { label: "Our Mission & Values", href: "/who-we-are/mission-values" },
      { label: "Board & Governance", href: "/who-we-are/board-governance" },
      { label: "Our Team", href: "/who-we-are/team" },
      {
        label: "Publications",
        children: [
          { label: "Annual Reports", href: "/who-we-are/publications/annual-reports" }
        ]
      }
    ]
  },
  {
    label: "Care & Community",
    children: [
      { label: "Life at CCC", href: "/care-community/life-at-ccc" },
      { label: "Care & Attention Home", href: "/care-community/care-and-attention-home" },
      { label: "Community Members Programme", href: "/care-community/community-members-programme" },
      { label: "Activities & Events", href: "/care-community/activities-and-events" },
      { label: "FAQs", href: "/care-community/faqs" }
    ]
  },
  {
    label: "Redevelopment",
    href: "/redevelopment"
  },
  {
    label: "News & Stories",
    children: [
      { label: "Latest News", href: "/news" },
      { label: "Noticeboard", href: "/news/noticeboard" },
      { label: "Stories", href: "/news/stories" },
      { label: "Media & Press", href: "/news/media-and-press" }
    ]
  },
  {
    label: "Get Involved",
    children: [
      { label: "Donate", href: "/donate" },
      { label: "Volunteer", href: "/get-involved/volunteer" }
    ]
  },
  {
    label: "Contact",
    href: "/contact"
  }
];

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Reset mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Logo size="md" showText={true} asLink={true} />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavigationMenu delayDuration={300}>
              <NavigationMenuList>
                {NAV_ITEMS.map((item) => (
                  <DesktopNavItem key={item.label} item={item} />
                ))}
              </NavigationMenuList>
            </NavigationMenu>
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
                >
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] overflow-y-auto">
                <nav className="flex flex-col gap-4 mt-8">
                  {NAV_ITEMS.map((item) => (
                    <MobileNavItem key={item.label} item={item} />
                  ))}
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

const DesktopNavItem = ({ item }: { item: NavItem }) => {
  const hasChildren = item.children && item.children.length > 0;

  if (!hasChildren) {
    return (
      <NavigationMenuItem>
        <Link to={item.href || "#"}>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            {item.label}
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[260px] p-2 gap-1">
          {item.children?.map((child, index) => (
            <DesktopDropdownItem key={index} item={child} />
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

const DesktopDropdownItem = ({ item }: { item: NavItem }) => {
  const hasChildren = item.children && item.children.length > 0;

  if (!hasChildren) {
    return (
      <li>
        <Link
          to={item.href || "#"}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <div className="text-sm font-medium leading-none">{item.label}</div>
        </Link>
      </li>
    );
  }

  return (
    <li className="space-y-1">
      <div
        className="block select-none rounded-md px-3 py-2 text-sm font-semibold leading-none text-muted-foreground"
      >
        {item.label}
      </div>
      <ul className="pl-2 space-y-1 border-l ml-2">
        {item.children?.map((child, index) => (
          <li key={index}>
            <Link
              to={child.href || "#"}
              className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
            >
              <div className="text-sm font-medium leading-none">{child.label}</div>
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
};

const MobileNavItem = ({ item }: { item: NavItem }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  if (!hasChildren) {
    return (
      <Link 
        to={item.href || "#"} 
        className="text-base font-medium text-foreground hover:text-primary transition-colors block py-2"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between text-base font-medium text-foreground hover:text-primary transition-colors py-2 w-full text-left"
      >
        {item.label}
        <ChevronDown 
          className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} 
        />
      </button>
      
      {isOpen && (
        <div className="flex flex-col gap-1 pl-4 border-l ml-1 my-1">
          {item.children?.map((child, index) => (
            <MobileNavItem key={index} item={child} />
          ))}
        </div>
      )}
    </div>
  );
};
