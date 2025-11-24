import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BoardGovernanceHero } from "@/components/BoardGovernanceHero";
import { HowWeAreGovernedSection } from "@/components/HowWeAreGovernedSection";
import { GovernanceStructureSection } from "@/components/GovernanceStructureSection";
import { CommitteeSection } from "@/components/CommitteeSection";
import { AccountabilityComplianceSection } from "@/components/AccountabilityComplianceSection";
import { useEffect, useState, useMemo } from "react";
import { getAllTeamMembers } from "@/lib/sanity.queries";
import type { SanityTeamMember } from "@/lib/sanity.types";
import { Users, Building2, Briefcase, Hammer, DollarSign } from "lucide-react";

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

const getManagementTeamMembers = (
    members: SanityTeamMember[]
): SanityTeamMember[] => {
    return members
        .filter(
            (member) =>
                member.role &&
                (member.role === "General Manager" ||
                    member.role === "Nurse Manager" ||
                    member.role === "Office Manager" ||
                    member.role === "Project Manager")
        )
        .sort((a, b) => {
            // Sort by order if available
            if (a.order !== null && b.order !== null) {
                return a.order - b.order;
            }
            if (a.order !== null) return -1;
            if (b.order !== null) return 1;
            return 0;
        });
};

const BoardGovernance = () => {
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
    const managementTeamMembers = useMemo(
        () => getManagementTeamMembers(teamMembers),
        [teamMembers]
    );

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

                {/* Executive Committee */}
                <CommitteeSection
                    title="Executive Committee (Board)"
                    introText="The Executive Committee members are volunteers from diverse professional backgrounds who provide strategic oversight and ensure CCC is well governed and financially responsible."
                    members={executiveCommitteeMembers}
                    loading={loading}
                    note="In accordance with our Articles of Association, one third of Executive Committee Members retire each year by rotation and may offer themselves for re-election, supporting healthy renewal and continuity of governance."
                />

                {/* Management Committee */}
                <CommitteeSection
                    title="Management Committee"
                    introText="The Management Committee is drawn from the Executive Committee. It meets regularly with the Management Team to review operations, staffing, resident and community issues, and reports back to the full Executive Committee."
                    members={managementCommitteeMembers}
                    loading={loading}
                    cleanRoleTitles={true}
                    sectionType="management-committee"
                />

                {/* Project Management Committee */}
                <CommitteeSection
                    title="Project Management Committee"
                    introText="The Project Management Committee reports directly to the Executive Committee and oversees CCC's redevelopment project at 63 Cumberland Road, working closely with our professional consultants. Together, this group ensures our new home is safe, modern, and cost-effective, while honouring the legacy of CCC."
                    members={projectManagementCommitteeMembers}
                    loading={loading}
                    cleanRoleTitles={true}
                    sectionType="project-management-committee"
                />

                {/* Management Team */}
                <CommitteeSection
                    title="Management Team"
                    introText="CCC's Management Team is responsible for delivering our services day to day and implementing the direction set by the Executive and Management Committees."
                    members={managementTeamMembers}
                    loading={loading}
                />

                {/* Accountability & Compliance */}
                <AccountabilityComplianceSection
                    title="Accountability & Compliance"
                    paragraphs={[
                        "China Coast Community Limited is incorporated and domiciled in Hong Kong and is approved as a charity under Section 88 of the Inland Revenue Ordinance.",
                        "Our financial statements are audited annually by independent auditors (currently Kenny Tam & Co., Certified Public Accountants) and prepared in accordance with all applicable Hong Kong Financial Reporting Standards and the Hong Kong Companies Ordinance.",
                        "The Executive Committee is ultimately responsible for ensuring that CCC remains financially sound, compliant, and true to its charitable objects.",
                    ]}
                />
            </main>

            <Footer />
        </div>
    );
};

export default BoardGovernance;
