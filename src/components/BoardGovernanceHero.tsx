import { Badge } from "@/components/ui/badge";

interface BoardGovernanceHeroProps {
  title: string;
  description: string;
  badgeText?: string;
}

export const BoardGovernanceHero = ({ title, description, badgeText }: BoardGovernanceHeroProps) => {
  return (
    <section className="bg-primary text-primary-foreground py-12 md:py-0 md:min-h-screen md:flex md:items-center">
      <div className="container mx-auto px-4 w-full">
        <div className="max-w-4xl md:mx-auto md:text-center">
          {badgeText && (
            <Badge className="mb-6 bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 md:mx-auto">
              {badgeText}
            </Badge>
          )}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-lg md:text-xl max-w-3xl leading-relaxed opacity-90 md:mx-auto">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};







