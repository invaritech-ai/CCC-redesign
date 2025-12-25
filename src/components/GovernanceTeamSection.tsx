import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { getAllTeamMembers } from "@/lib/sanity.queries";
import type { SanityTeamMember } from "@/lib/sanity.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface GovernanceTeamSectionProps {
  title: string;
  introText: string;
  projectManagerName?: string;
  projectManagerJoinedDate?: string;
}

const getExecutiveCommitteeMembers = (
  members: SanityTeamMember[]
): SanityTeamMember[] => {
  return members
    .filter(
      (member) =>
        member.role &&
        (member.role === "Chairman" ||
          member.role === "Hon. Legal Adviser" ||
          member.role === "Hon. Treasurer" ||
          member.role === "Hon. Medical Adviser" ||
          member.role === "Board Member")
    )
    .sort((a, b) => {
      if (a.order !== null && b.order !== null) return a.order - b.order;
      if (a.order !== null) return -1;
      if (b.order !== null) return 1;
      return 0;
    });
};

const getManagementCommitteeMembers = (
  members: SanityTeamMember[]
): SanityTeamMember[] => {
  const filtered = members.filter(
    (member) =>
      member.role &&
      (member.role === "Chair Management Committee" ||
        member.role === "Member Management Committee")
  );

  return filtered.sort((a, b) => {
    const aIsChair = a.role === "Chair Management Committee";
    const bIsChair = b.role === "Chair Management Committee";

    if (aIsChair && !bIsChair) return -1;
    if (!aIsChair && bIsChair) return 1;

    if (a.order !== null && b.order !== null) return a.order - b.order;
    if (a.order !== null) return -1;
    if (b.order !== null) return 1;
    return 0;
  });
};

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
      if (a.order !== null && b.order !== null) return a.order - b.order;
      if (a.order !== null) return -1;
      if (b.order !== null) return 1;

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
  const [activeCommitteeKey, setActiveCommitteeKey] = useState<
    "executive" | "management" | "project" | null
  >(null);

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

  const committees = useMemo(() => {
    return [
      {
        key: "executive" as const,
        name: "Executive Committee",
        members: getExecutiveCommitteeMembers(teamMembers),
      },
      {
        key: "management" as const,
        name: "Management Committee",
        members: getManagementCommitteeMembers(teamMembers),
      },
      {
        key: "project" as const,
        name: "Project Management Committee",
        members: getProjectManagementCommitteeMembers(teamMembers),
      },
    ];
  }, [teamMembers]);

  const activeCommittee = useMemo(() => {
    if (!activeCommitteeKey) return null;
    return committees.find((committee) => committee.key === activeCommitteeKey);
  }, [activeCommitteeKey, committees]);

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            {title}
          </h2>
          <div className="space-y-6 mb-10">
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

          <div className="grid gap-4 md:grid-cols-3">
            {committees.map((committee) => (
              <button
                key={committee.key}
                type="button"
                onClick={() => setActiveCommitteeKey(committee.key)}
                className="rounded-lg border border-border/50 bg-card p-6 text-left shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <h3 className="text-lg font-semibold text-foreground">
                  {committee.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {loading
                    ? "Loading members…"
                    : `${committee.members.length} member${
                        committee.members.length === 1 ? "" : "s"
                      }`}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <Dialog
        open={Boolean(activeCommittee)}
        onOpenChange={(open) => {
          if (!open) setActiveCommitteeKey(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{activeCommittee?.name}</DialogTitle>
          </DialogHeader>
          {loading ? (
            <p className="text-sm text-muted-foreground">
              Loading committee members...
            </p>
          ) : activeCommittee && activeCommittee.members.length > 0 ? (
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {activeCommittee.members.map((member) => (
                <li
                  key={member._id}
                  className="rounded-md border border-border/50 bg-card/50 px-3 py-2 text-sm text-foreground"
                >
                  {member.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              No committee members are listed yet.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
