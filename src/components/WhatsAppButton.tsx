import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WhatsAppButtonProps {
  size?: "sm" | "md" | "lg" | "default" | "icon";
  className?: string;
  variant?: "button" | "link" | "floating";
  showText?: boolean;
}

const WHATSAPP_NUMBER = "85261104078";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const WhatsAppButton = ({ 
  size = "default",
  className,
  variant = "button",
  showText = true
}: WhatsAppButtonProps) => {
  const iconSize = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-5 w-5" : "h-4 w-4";
  const gap = size === "sm" ? "gap-1" : size === "lg" ? "gap-2" : "gap-1";
  
  // WhatsApp green color
  const whatsappGreen = "#25D366";
  
  const baseClasses = cn(
    "min-h-[44px] min-w-[44px]",
    gap,
    className
  );

  if (variant === "floating") {
    return (
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "fixed bottom-6 right-6 z-40",
          "flex items-center justify-center",
          "rounded-full shadow-lg",
          "bg-[#25D366] hover:bg-[#20BA5A] active:bg-[#1DA851]",
          "text-white",
          "transition-all duration-200",
          "hover:scale-105 active:scale-95",
          "h-16 w-16 md:h-20 md:w-20",
          "min-h-[64px] min-w-[64px]"
        )}
        aria-label="Message us on WhatsApp"
      >
        <FaWhatsapp 
          className="h-7 w-7 md:h-8 md:w-8" 
          aria-hidden="true"
        />
        {showText && (
          <span className="ml-2 font-medium hidden md:inline-block">
            Message Us
          </span>
        )}
      </a>
    );
  }

  if (variant === "link") {
    return (
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          baseClasses,
          "inline-flex items-center justify-center",
          "text-[#25D366] hover:text-[#20BA5A]",
          "transition-colors",
          "underline-offset-4 hover:underline"
        )}
        aria-label="Message us on WhatsApp"
      >
        <FaWhatsapp className={iconSize} aria-hidden="true" />
        {showText && <span>WhatsApp</span>}
      </a>
    );
  }

  // Default button variant
  return (
    <Button 
      size={size} 
      className={cn(
        baseClasses,
        "bg-[#25D366] hover:bg-[#20BA5A] active:bg-[#1DA851]",
        "text-white",
        "shadow-lg hover:shadow-xl",
        "transition-all duration-200"
      )}
      asChild
    >
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="min-h-[44px] flex items-center justify-center"
        aria-label="Message us on WhatsApp"
      >
        <FaWhatsapp className={iconSize} aria-hidden="true" />
        {showText && <span>Message Us</span>}
      </a>
    </Button>
  );
};

