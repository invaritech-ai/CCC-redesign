import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AboutHero } from "@/components/AboutHero";
import { AboutIntroduction } from "@/components/AboutIntroduction";
import { AboutHistory } from "@/components/AboutHistory";
import { CommunityMembersSection } from "@/components/CommunityMembersSection";
import { TeamMembersSection } from "@/components/TeamMembersSection";
import { AnnualReportsSection } from "@/components/AnnualReportsSection";
import { CoreValuesSection } from "@/components/CoreValuesSection";
import { Heart, Users, Calendar, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllTeamMembers, getAllReports } from "@/lib/sanity.queries";
import type { SanityTeamMember } from "@/lib/sanity.types";

const About = () => {
  const [teamMembers, setTeamMembers] = useState<SanityTeamMember[]>([]);
  const [latestReport, setLatestReport] = useState<any | null>(null);
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [teamData, reportsData] = await Promise.all([
        getAllTeamMembers(),
        getAllReports(),
      ]);
      setTeamMembers(teamData);
      setLoadingTeam(false);
      setLatestReport(reportsData.length > 0 ? reportsData[0] : null); // Show only latest report
      setLoadingReports(false);
    };
    fetchData();
  }, []);

  const historyItems = [
    {
      year: "1978",
      title: "The Beginning",
      description: [
        "China Coast Community Limited (CCC) was set up in 1978. It is approved as a charity under Section 88 of the Inland Revenue Ordinance.",
        "The history of CCC dates back to March, 1978 when the Reverend Stephen Sidebotham, the Dean of St John's Cathedral, convened a meeting of those concerned with care of the elderly then in Hong Kong. A detailed survey revealed that there was an urgent need for residential facilities for people in Hong Kong whose main language was English and the concept of CCC was born.",
      ],
    },
    {
      year: "1979",
      title: "First Home",
      description:
        "In 1979, through the support of the Hong Kong Jockey Club and an interest-free loan from the Hong Kong Government, 63 Cumberland Road was purchased and converted into residential accommodation for eight residents.",
    },
    {
      year: "1982",
      title: "Expansion",
      description:
        "This was subsequently extended in 1982 to provide additional facilities at the Home, financed by generous donations from a number of individual and corporate benefactors.",
    },
    {
      year: "2000",
      title: "Care and Attention Home",
      description:
        "The needs of the residents have changed drastically over the years resulting in the CCC becoming fully licensed as a Care and Attention Home in April 2000 with professional Nursing Care provided on a 24 hour basis.",
    },
    {
      year: "Today",
      title: "",
      description:
        "Most of our new admissions are still active people when they enter CCC. However, they have the security of knowing if they become less able or highly dependent they will be cared for with respect and dignity.",
    },
  ];

  const coreValues = [
    {
      icon: Heart,
      title: "Compassion",
      description:
        "Treating every individual with kindness, empathy, and respect.",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "Building connections and fostering a sense of belonging for all.",
    },
    {
      icon: Award,
      title: "Excellence",
      description:
        "Providing the highest quality care and services to our members.",
    },
    {
      icon: Calendar,
      title: "Engagement",
      description:
        "Creating meaningful activities that enrich the lives of seniors.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main id="main-content" className="flex-1">
        <AboutHero
          title="Welcome to China Coast Community"
          description="China Coast Community Limited (CCC) was set up in 1978. It is approved as a charity under Section 88 of the Inland Revenue Ordinance."
          badgeText="Section 88 Charity"
        />

        <AboutIntroduction
          title="About Us"
          paragraphs={[
            "China Coast Community Limited (CCC) was set up in 1978. It is approved as a charity under Section 88 of the Inland Revenue Ordinance.",
            "The history of CCC dates back to March, 1978 when the Reverend Stephen Sidebotham, the Dean of St John's Cathedral, convened a meeting of those concerned with care of the elderly then in Hong Kong. A detailed survey revealed that there was an urgent need for residential facilities for people in Hong Kong whose main language was English and the concept of CCC was born.",
          ]}
        />

        <AboutHistory title="Our History" items={historyItems} />

        <CommunityMembersSection
          title="Community Members"
          paragraphs={[
            "In addition to our in-house residents, CCC also caters to over 80 Community Members who live in their own homes. The Community Members join in our regular outings and activities.",
            "This gives the opportunity for both those in the Home and in the Community to meet and make new friends and to ease any loneliness they may experience.",
          ]}
        />

        <TeamMembersSection
          title="Our Team"
          teamMembers={teamMembers}
          loading={loadingTeam}
        />

        <AnnualReportsSection
          title="Annual Reports"
          latestReport={latestReport}
          loading={loadingReports}
        />

        <CoreValuesSection title="Our Core Values" values={coreValues} />
      </main>

      <Footer />
    </div>
  );
};

export default About;
