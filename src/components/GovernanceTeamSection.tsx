import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface GovernanceTeamSectionProps {
  title: string;
  introText: string;
  projectManagerName?: string;
  projectManagerJoinedDate?: string;
}

export const GovernanceTeamSection = ({
  title,
  introText,
  projectManagerName,
  projectManagerJoinedDate,
}: GovernanceTeamSectionProps) => {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            {title}
          </h2>
          <div className="space-y-6">
            <p className="text-base md:text-lg text-foreground leading-relaxed">
              {introText}
            </p>
            {projectManagerName && projectManagerJoinedDate && (
              <p className="text-base md:text-lg text-foreground leading-relaxed">
                The Project Manager, {projectManagerName}, joined CCC in{" "}
                {projectManagerJoinedDate} to coordinate the day-to-day
                management of the redevelopment and to work closely with our
                professional advisers.
              </p>
            )}
            <div className="text-center pt-2">
              <Button variant="outline" size="lg" className="gap-2" asChild>
                <Link to="/who-we-are/board-governance">
                  <span className="md:hidden">Governance & Committees</span>
                  <span className="hidden md:inline">
                    Read more about our governance and committees
                  </span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};