import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AboutHero } from "@/components/AboutHero";
import { ProjectTimeline } from "@/components/ProjectTimeline";
import { ImageGallery } from "@/components/ImageGallery";
import { WhyRedevelopingSection } from "@/components/WhyRedevelopingSection";
import { WhatIsBeingBuiltSection } from "@/components/WhatIsBeingBuiltSection";
import { WhereResidentsAreNowSection } from "@/components/WhereResidentsAreNowSection";
import { HowCareContinuesSection } from "@/components/HowCareContinuesSection";
import { GovernanceTeamSection } from "@/components/GovernanceTeamSection";

const Future = () => {
    // Timeline phases for the reconstruction project
    const timelinePhases = [
        {
            name: "Pre-Construction Phase",
            status: "completed" as const,
            description:
                "Feasibility studies completed. Architect's General Building Plans submitted and Buildings Department Approval received for demolition and construction. All consents have been obtained.",
        },
        {
            name: "Construction Phase",
            status: "in-progress" as const,
            description:
                "Construction is currently underway. The new facility should be completed in two to three years.",
        },
        {
            name: "Completion & Opening",
            status: "upcoming" as const,
            description:
                "The new 45-bed facility will open, featuring mostly single rooms with en suite shower rooms, wide corridors, two lifts, and modern amenities.",
        },
    ];

    // Gallery images - using real project images
    const galleryImages = [
        {
            src: "/central-lawn.webp",
            alt: "Central Lawn area",
        },
        {
            src: "/entrance.webp",
            alt: "Entrance area",
        },
        {
            src: "/flower-arbor.webp",
            alt: "Flower Arbor",
        },
        {
            src: "/project-site.webp",
            alt: "Project image",
        },
        {
            src: "/isometric-view.webp",
            alt: "Isometric view",
        },
        {
            src: "/plan-view.webp",
            alt: "Plan view",
        },
        {
            src: "/prep-work.webp",
            alt: "Preparation work",
        },
        {
            src: "/private-terrace.webp",
            alt: "Private Terrace",
        },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />

            <main id="main-content" className="flex-1">
                {/* Hero Section */}
                <AboutHero
                    title="Redeveloping our home at 63 Cumberland Road"
                    description="We are rebuilding China Coast Community's residential care home to create a safer, more modern environment for future generations of elders, while continuing to care for our community throughout construction."
                    badgeText="Redevelopment Project"
                />

                {/* Section 2: Why we are redeveloping */}
                <WhyRedevelopingSection
                    title="Why is CCC redeveloping?"
                    paragraphs={[
                        "The building at 63 Cumberland Road, which housed CCC for many years, reached a point where significant upgrading was required to meet latest safety and building standards and to prepare for future care needs. After careful review, the Board decided that a full redevelopment would best secure the long-term future of CCC as a home for English-speaking elders in Hong Kong.",
                    ]}
                    benefits={[
                        "Provide a modern, safe residential care home designed to current regulations.",
                        "Improve accessibility and comfort for elders with higher care needs.",
                        "Create a building that can sustain CCC's mission for many more decades.",
                    ]}
                    quote={{
                        text: "After studying the options, CCC's Consultants advised us that the existing buildings could not be extensively renovated to achieve CCC's goal. Reconstruction was the only feasible way to provide the optimal services for our residents and the community. The Consultants also advised that it was not feasible to re-build with the residents in situ as it would be too dusty, too noisy, too disruptive, and potentially dangerous for them.",
                        author: "Corinne Remedios, Chair of CCC's Executive Committee",
                    }}
                />

                {/* Section 3: What is being built */}
                <WhatIsBeingBuiltSection
                    title="What the new home will offer"
                    intentions={[
                        "Provide comfortable bedrooms with improved privacy and accessibility, so residents can live with dignity.",
                        "Include dedicated spaces for activities, dining, rehabilitation and quiet rest.",
                        "Meet latest fire, health and safety standards under RCHE regulations in Hong Kong.",
                        "Enable CCC to provide care to residents with varying care requirements.",
                    ]}
                    paragraphs={[]}
                    quotes={[
                        {
                            text: "The site has such a nice environment, there is such calmness there in the context of Hong Kong, so I try to capture that calmness, that quietness, this landscape, the garden space – the greenery is very precious. I want to integrate all that into the building. For some of the residents who are on the first or second floor, even if they have limited mobility and can't go down into the garden itself, the design means that they will feel they are in the garden,",
                            author: "Billy Tam, Lead Architect, Thomas Chow Architects Ltd.",
                        },
                    ]}
                />

                {/* Section 4: Timeline and current status */}
                <section className="py-12 md:py-20">
                    <ProjectTimeline phases={timelinePhases} />
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center mt-6">
                            <p className="text-base md:text-lg text-muted-foreground">
                                We will update this page as key milestones are
                                reached.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Section 5: Where residents and services are now */}
                <WhereResidentsAreNowSection
                    paragraphs={[
                        "While our home at 63 Cumberland Road is being rebuilt, CCC continues to support former residents and other English-speaking elders through our Community Membership scheme and outreach.",
                    ]}
                    communityItems={[
                        "We launched a Community Membership scheme to support former residents and other English-speaking elders.",
                        "We organise regular outings, workshops, social events, and seasonal gatherings.",
                        "We provide ongoing outreach to help elders remain connected and supported.",
                    ]}
                />

                {/* Section 6: How care continues during redevelopment */}
                <HowCareContinuesSection
                    title="Continuing care during redevelopment"
                    paragraphs={[
                        "Although our building is being redeveloped, our commitment to elders has not paused.",
                        "During redevelopment, CCC is not operating a residential care home at 63 Cumberland Road. Our former residents have been relocated to alternative accommodation, and CCC remains in close contact with them and their families.",
                    ]}
                    teamActivities={[
                        "Keeps in touch with former residents and Community Members.",
                        "Organises social, recreational and seasonal events.",
                        "Helps reduce isolation by keeping in connections within the CCC community.",
                    ]}
                />

                {/* Section 7: Governance & professional team */}
                <GovernanceTeamSection
                    title="How the project is governed"
                    introText="The redevelopment is overseen by CCC's volunteer Executive Committee and Management Committee, with a dedicated Project Management Committee providing specialist oversight."
                    projectManagerName="Ms Tiffany Wong"
                    projectManagerJoinedDate="July 2025"
                />

                {/* Section 8: Image Gallery */}
                <ImageGallery
                    images={galleryImages}
                    title="Project Visualizations"
                />
            </main>

            <Footer />
        </div>
    );
};

export default Future;