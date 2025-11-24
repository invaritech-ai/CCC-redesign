import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { getAllTeamMembers } from "@/lib/sanity.queries";
import type { SanityTeamMember } from "@/lib/sanity.types";
import { CommitteeSection } from "./CommitteeSection";

interface GovernanceTeamSectionProps {
  title: string;
  introText: string;
  projectManagerName?: string;
  projectManagerJoinedDate?: string;
}

const getProjectManagementCommitteeMembers = (
  members: SanityTeamMember[]
): SanityTeamMember[] => {
  return members
    .filter(
      (member) =>
        member.role &&
        (member.role === "Project Management Committee" ||
          member.role === "Ex-officio members Project management")
    )
    .sort((a, b) => {
      // Sort by order if available
      if (a.order !== null && b.order !== null) {
        return a.order - b.order;
      }
      if (a.order !== null) return -1;
      if (b.order !== null) return 1;
      // Ex-officio members come after regular members
      const aIsExOfficio = a.role?.includes("Ex-officio");
      const bIsExOfficio = b.role?.includes("Ex-officio");
      if (aIsExOfficio && !bIsExOfficio) return 1;
      if (!aIsExOfficio && bIsExOfficio) return -1;
      return 0;
    });
};

export const GovernanceTeamSection = ({
  title,
  introText,
  projectManagerName,
  projectManagerJoinedDate,
}: GovernanceTeamSectionProps) => {
  const [teamMembers, setTeamMembers] = useState<SanityTeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      setLoading(true);
      try {
        const members = await getAllTeamMembers();
        setTeamMembers(members);
      } catch (error) {
        console.error("Error fetching team members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  const projectManagementCommitteeMembers = useMemo(
    () => getProjectManagementCommitteeMembers(teamMembers),
    [teamMembers]
  );

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            {title}
          </h2>
          <div className="space-y-6 mb-8">
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
          </div>
        </div>
      </div>

      {projectManagementCommitteeMembers.length > 0 && (
        <div className="mb-8">
          <CommitteeSection
            title="Project Management Committee"
            introText=""
            members={projectManagementCommitteeMembers}
            loading={loading}
            cleanRoleTitles={true}
            sectionType="project-management-committee"
          />
        </div>
      )}

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mt-8">
            <Button variant="outline" size="lg" className="gap-2" asChild>
              <Link to="/who-we-are/board-governance">
                Read more about our governance and committees
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

