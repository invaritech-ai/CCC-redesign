import React from "react";
import { Link } from "react-router-dom";
import { LucideIcon, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HighlightCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  link: string;
  category?: string;
  className?: string;
}

export const HighlightCard: React.FC<HighlightCardProps> = ({
  title,
  description,
  icon: Icon,
  link,
  category,
  className,
}) => {
  return (
    <Link
      to={link}
      className={cn(
        "group relative flex h-full flex-col rounded-lg border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1",
        className
      )}
    >
      {/* Icon */}
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-6 w-6" />
      </div>

      {/* Category */}
      {category && (
        <div className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {category}
        </div>
      )}

      {/* Title */}
      <h3 className="mb-2 text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="mb-4 flex-1 text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}

      {/* Link indicator */}
      <div className="flex items-center gap-2 text-sm font-medium text-primary opacity-100 md:opacity-0 transition-opacity md:group-hover:opacity-100">
        Learn more
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
};

