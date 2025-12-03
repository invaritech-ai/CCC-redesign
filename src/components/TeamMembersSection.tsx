import { Card, CardContent } from "@/components/ui/card";
import { PortableText } from "./PortableText";
import type { SanityTeamMember } from "@/lib/sanity.types";

interface TeamMembersSectionProps {
  title: string;
  teamMembers: SanityTeamMember[];
  loading?: boolean;
}

export const TeamMembersSection = ({
  title,
  teamMembers,
  loading = false,
}: TeamMembersSectionProps) => {
  if (teamMembers.length === 0 && !loading) {
    return null;
  }

  return (
    <section className="py-12 md:py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">{title}</h2>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-base md:text-lg text-foreground">
                Loading team members...
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member) => (
                <Card key={member._id} className="overflow-hidden">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-2 text-foreground">
                      {member.name}
                    </h3>
                    {member.role && (
                      <p className="text-base font-medium text-primary mb-4">
                        {member.role}
                      </p>
                    )}
                    {member.bio && (
                      <div className="text-base text-foreground leading-relaxed">
                        <PortableText blocks={member.bio} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

