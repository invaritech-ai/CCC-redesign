import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BoardGovernanceHero } from "@/components/BoardGovernanceHero";
import { HowWeAreGovernedSection } from "@/components/HowWeAreGovernedSection";
import { GovernanceStructureSection } from "@/components/GovernanceStructureSection";
import { useEffect, useState, useMemo } from "react";
import { getAllTeamMembers } from "@/lib/sanity.queries";
import type { SanityTeamMember } from "@/lib/sanity.types";
import { Users, Building2, Briefcase, Hammer, DollarSign } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

// Helper functions to filter team members by role
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
            // Sort by order if available, otherwise maintain original order
            if (a.order !== null && b.order !== null) {
                return a.order - b.order;
            }
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

    // Sort: Chair first, then Members, maintaining order numbers within each group
    return filtered.sort((a, b) => {
        const aIsChair = a.role === "Chair Management Committee";
        const bIsChair = b.role === "Chair Management Committee";

        // Chair always comes first
        if (aIsChair && !bIsChair) return -1;
        if (!aIsChair && bIsChair) return 1;

        // Within same type, sort by order if available
        if (a.order !== null && b.order !== null) {
            return a.order - b.order;
        }
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

const BoardGovernance = () => {
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

    // Filter team members by committee
    const executiveCommitteeMembers = useMemo(
        () => getExecutiveCommitteeMembers(teamMembers),
        [teamMembers]
    );
    const managementCommitteeMembers = useMemo(
        () => getManagementCommitteeMembers(teamMembers),
        [teamMembers]
    );
    const projectManagementCommitteeMembers = useMemo(
        () => getProjectManagementCommitteeMembers(teamMembers),
        [teamMembers]
    );

    const committees = useMemo(() => {
        return [
            {
                key: "executive" as const,
                name: "Executive Committee",
                introText:
                    "The Executive Committee members are volunteers from diverse professional backgrounds who provide strategic oversight and ensure CCC is well governed and financially responsible.",
                members: executiveCommitteeMembers,
                note: "In accordance with our Articles of Association, one third of Executive Committee Members retire each year by rotation and may offer themselves for re-election, supporting healthy renewal and continuity of governance.",
            },
            {
                key: "management" as const,
                name: "Management Committee",
                introText:
                    "The Management Committee is drawn from the Executive Committee. It meets regularly with the Management Team to review operations, staffing, resident and community issues, and reports back to the full Executive Committee.",
                members: managementCommitteeMembers,
            },
            {
                key: "project" as const,
                name: "Project Management Committee",
                introText:
                    "The Project Management Committee reports directly to the Executive Committee and oversees CCC's redevelopment project at 63 Cumberland Road, working closely with our professional consultants. Together, this group ensures our new home is safe, modern, and cost-effective, while honouring the legacy of CCC.",
                members: projectManagementCommitteeMembers,
            },
        ];
    }, [
        executiveCommitteeMembers,
        managementCommitteeMembers,
        projectManagementCommitteeMembers,
    ]);

    const activeCommittee = useMemo(() => {
        if (!activeCommitteeKey) return null;
        return committees.find(
            (committee) => committee.key === activeCommitteeKey
        );
    }, [activeCommitteeKey, committees]);

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />

            <main id="main-content" className="flex-1">
                {/* Hero Section */}
                <BoardGovernanceHero
                    title="Board & Governance"
                    description="Experienced volunteers and professionals working together to steward CCC's mission."
                />

                {/* How We Are Governed */}
                <HowWeAreGovernedSection
                    title="How We Are Governed"
                    paragraphs={[
                        "China Coast Community is overseen by a volunteer Executive Committee made up of long-standing Hong Kong residents with relevant professional expertise. From within this group, a smaller Management Committee works closely with the Management Team on the day-to-day running of our services.",
                        <>
                            In addition, a Project Management Committee oversees
                            the redevelopment of our home at{" "}
                            <strong>63 Cumberland Road</strong>, while a Funding
                            Committee advises on fundraising initiatives. All
                            Executive and Fundraising Committee members are
                            volunteers.
                        </>,
                    ]}
                />

                {/* Governance Structure */}
                <GovernanceStructureSection
                    title="Our Governance Structure"
                    introText="Our governance structure ensures clear oversight and accountability through dedicated committees and teams working together."
                    governanceItems={[
                        {
                            title: "Executive Committee (ExCo)",
                            description:
                                "Overall strategic direction, governance, and oversight.",
                            icon: Users,
                        },
                        {
                            title: "Management Committee",
                            description:
                                "Drawn from ExCo to handle day-to-day operational oversight and to meet regularly with the Management Team.",
                            icon: Building2,
                        },
                        {
                            title: "Management Team",
                            description:
                                "General Manager, Nurse Manager, and Office Manager; responsible for the delivery of services and reporting to the Management Committee and ExCo.",
                            icon: Briefcase,
                        },
                        {
                            title: "Project Management Committee",
                            description:
                                "Reports directly to ExCo and oversees the redevelopment project at 63 Cumberland Road.",
                            icon: Hammer,
                        },
                        {
                            title: "Funding Committee",
                            description:
                                "Comprised of Executive Committee members, advising on fundraising initiatives. All members are volunteers.",
                            icon: DollarSign,
                        },
                    ]}
                />

                {/* Committee Buttons Section */}
                <section className="py-12 md:py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                                Our Committees
                            </h2>
                            <div className="grid gap-4 md:grid-cols-3">
                                {committees.map((committee) => (
                                    <button
                                        key={committee.key}
                                        type="button"
                                        onClick={() =>
                                            setActiveCommitteeKey(committee.key)
                                        }
                                        className="rounded-lg border border-border/50 bg-card p-6 text-left shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    >
                                        <h3 className="text-lg font-semibold text-foreground">
                                            {committee.name}
                                        </h3>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {loading
                                                ? "Loading members…"
                                                : `${committee.members.length} member${
                                                      committee.members
                                                          .length === 1
                                                          ? ""
                                                          : "s"
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
                                <DialogTitle>
                                    {activeCommittee?.name}
                                </DialogTitle>
                            </DialogHeader>
                            {activeCommittee?.introText && (
                                <p className="text-sm text-muted-foreground mb-4">
                                    {activeCommittee.introText}
                                </p>
                            )}
                            {loading ? (
                                <p className="text-sm text-muted-foreground">
                                    Loading committee members...
                                </p>
                            ) : activeCommittee &&
                              activeCommittee.members.length > 0 ? (
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
                            {activeCommittee?.note && (
                                <p className="text-xs text-muted-foreground italic mt-4">
                                    {activeCommittee.note}
                                </p>
                            )}
                        </DialogContent>
                    </Dialog>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default BoardGovernance;