import { Card, CardContent } from "@/components/ui/card";
import { PortableText } from "./PortableText";
import { getImageUrl } from "@/lib/sanityImage";
import { User } from "lucide-react";
import type { SanityTeamMember } from "@/lib/sanity.types";

interface TeamMembersSectionProps {
  title: string;
  teamMembers: SanityTeamMember[];
  loading?: boolean;
}

// Helper function to get initials from name
const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// Helper function to generate a consistent color based on name
const getColorFromName = (name: string): string => {
  const colors = [
    "bg-primary/20 text-primary",
    "bg-success/20 text-success",
    "bg-secondary text-secondary-foreground",
    "bg-muted text-muted-foreground",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

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
                  <div className="aspect-square w-full overflow-hidden bg-secondary flex items-center justify-center">
                    {member.photo ? (
                      <img
                        src={
                          getImageUrl(member.photo, {
                            width: 400,
                            height: 400,
                            format: "webp",
                          }) || ""
                        }
                        alt={member.name}
                        className="w-full h-full object-cover"
                        width="400"
                        height="400"
                      />
                    ) : (
                      <div
                        className={`w-full h-full flex items-center justify-center ${getColorFromName(
                          member.name
                        )}`}
                      >
                        <div className="text-center">
                          <div className="text-4xl md:text-5xl font-bold mb-2">
                            {getInitials(member.name)}
                          </div>
                          <User className="h-12 w-12 mx-auto opacity-50" aria-hidden="true" />
                        </div>
                      </div>
                    )}
                  </div>
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

