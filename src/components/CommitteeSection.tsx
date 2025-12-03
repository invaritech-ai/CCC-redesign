import { Card, CardContent } from "@/components/ui/card";
import { PortableText } from "./PortableText";
import type { SanityTeamMember } from "@/lib/sanity.types";

interface CommitteeSectionProps {
    title: string;
    introText?: string;
    members: SanityTeamMember[];
    loading?: boolean;
    note?: string;
    cleanRoleTitles?: boolean;
    sectionType?: "management-committee" | "project-management-committee";
}

// Helper function to clean role titles
const cleanRoleTitle = (role: string, sectionType?: string): string => {
    if (!sectionType) return role;

    if (sectionType === "management-committee") {
        // Remove "Management Committee" from titles
        return role
            .replace(/Member Management Committee/gi, "Member")
            .replace(/Chair Management Committee/gi, "Chair")
            .trim();
    }

    if (sectionType === "project-management-committee") {
        // Convert "Project Management Committee" to "Member"
        if (role.includes("Project Management Committee")) {
            return "Member";
        }
        // Keep "Ex-officio members" as is but clean it up
        if (role.includes("Ex-officio members")) {
            return "Ex-officio member";
        }
    }

    return role;
};

export const CommitteeSection = ({
    title,
    introText,
    members,
    loading = false,
    note,
    cleanRoleTitles = false,
    sectionType,
}: CommitteeSectionProps) => {
    if (members.length === 0 && !loading) {
        return null;
    }

    return (
        <section className="py-12 md:py-20">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                        {title}
                    </h2>

                    {introText && (
                        <div className="max-w-4xl mx-auto mb-8">
                            <p className="text-base md:text-lg text-foreground leading-relaxed">
                                {introText}
                            </p>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-12">
                            <p className="text-base md:text-lg text-foreground">
                                Loading team members...
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {members.map((member) => (
                                <Card
                                    key={member._id}
                                    className="overflow-hidden"
                                >
                                    <CardContent className="pt-6">
                                        <h3 className="text-xl font-semibold mb-2 text-foreground">
                                            {member.name}
                                        </h3>
                                        {member.role && (
                                            <p className="text-base font-medium text-primary mb-4">
                                                {cleanRoleTitles && sectionType
                                                    ? cleanRoleTitle(
                                                          member.role,
                                                          sectionType
                                                      )
                                                    : member.role}
                                            </p>
                                        )}
                                        {member.bio && (
                                            <div className="text-base text-foreground leading-relaxed">
                                                <PortableText
                                                    blocks={member.bio}
                                                />
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {note && (
                        <div className="max-w-4xl mx-auto mt-6">
                            <p className="text-sm text-muted-foreground italic text-center">
                                {note}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
