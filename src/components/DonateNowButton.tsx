import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface DonateNowButtonProps {
  size?: "sm" | "md" | "lg" | "default" | "icon";
  className?: string;
}

export const DonateNowButton = ({ 
  size = "default",
  className 
}: DonateNowButtonProps) => {
  const iconSize = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-5 w-5" : "h-4 w-4";
  const gap = size === "sm" ? "gap-1" : size === "lg" ? "gap-2" : "gap-1";

  return (
    <Button 
      variant="success" 
      size={size} 
      className={cn(gap, className)} 
      asChild
    >
      <Link to="/support/donate">
        <Heart className={iconSize} />
        Donate Now
      </Link>
    </Button>
  );
};


