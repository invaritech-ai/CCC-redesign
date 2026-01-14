import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AboutHero } from "@/components/AboutHero";
import { AboutUniqueIdentity } from "@/components/AboutUniqueIdentity";
import { AboutCommitmentSection } from "@/components/AboutCommitmentSection";
import { AboutRedevelopmentSection } from "@/components/AboutRedevelopmentSection";
import { AboutCTASection } from "@/components/AboutCTASection";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <AboutHero
          title="A Caring Home for Hong Kong's English-Speaking Elders"
          description="For over 45 years, China Coast Community has been Hong Kong's only residential care home dedicated to English-speaking elderly persons of all creeds, cultures, and ethnicities. We provide exceptional care, foster community, and champion dignity for every senior we serve."
        />

        {/* Our Unique Identity */}
        <AboutUniqueIdentity
          title="Our Unique Place in Hong Kong's Community"
          paragraphs={[
            "Since 1978, China Coast Community (CCC) has stood apart as the sole residential care home in Hong Kong exclusively for English-speaking elderly individuals. Our commitment extends beyond language; we embrace all creeds, cultures, and ethnicities, ensuring a truly inclusive environment. From our inception, we have proudly allocated 30% of our residential facilities to those receiving CSSA or equivalent support, upholding our founding principle of accessible, high-quality care for all.",
          ]}
          pullQuote="For over 45 years, CCC delivered excellent care to all its residents and extended its reach to its English-speaking community members."
        />

        {/* Our Commitment to the Community */}
        <AboutCommitmentSection
          title="Continuing Our Mission: Care Beyond Our Walls"
          paragraphs={[
            "While our residential home at 63 Cumberland Road undergoes an exciting redevelopment, our dedication to the English-speaking elderly community remains unwavering. We have temporarily suspended residential services to build a state-of-the-art modern facility, expected to reopen by mid-2028. In the interim, CCC has intensified its focus on supporting elders in the wider community. We currently serve 80+ active Community Members, providing vital social connections and activities to combat isolation and loneliness. Our team also continues to pay regular visits to former residents, ensuring their ongoing well-being and connection to the CCC family.",
          ]}
          stats={[
            { number: "80+", label: "Current Community Members" },
            { number: "130+", label: "Enquiries for residential places upon reopening" },
            { number: "80+", label: "Persons on the waiting list for a place" },
          ]}
        />

        {/* Looking Ahead: Our Redevelopment Journey */}
        <AboutRedevelopmentSection
          title="Building a State-of-the-Art Home for the Future"
          paragraphs={[
            "Our redevelopment project at 63 Cumberland Road is progressing, thanks to significant funding from the Hong Kong Jockey Club Charities Trust and consent from the Lands Department. The new CCC Home will feature two 3-storey blocks, accommodating 45 beds and an Isolation Room, with 39 single and 3 double rooms—most with en-suite shower facilities. Designed with cutting-edge gerontechnology and beautiful outdoor spaces, our new home will offer world-standard facilities, providing a safe, comfortable, and friendly place for our residents to live in privacy and age-in-place with dignity. We anticipate being operational again as a residential home by 2028/early 2029.",
          ]}
        />

        {/* Call to Action Section */}
        <AboutCTASection
          title="Join Our Journey"
          description="Your support helps us create a safe, modern home to reopen stronger. Discover how you can make a difference today."
        />
      </main>

      <Footer />
    </div>
  );
};

export default About;
