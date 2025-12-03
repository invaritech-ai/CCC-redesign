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
import { HowToSupportSection } from "@/components/HowToSupportSection";

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
                    introParagraph="The new building is being designed as a purpose-built residential care home. While technical details may evolve as the project progresses, the intention is to:"
                    intentions={[
                        "Provide comfortable bedrooms with improved privacy and accessibility.",
                        "Include dedicated spaces for activities, dining, physiotherapy and quiet rest.",
                        "Meet latest fire, health and safety standards.",
                        "Enable CCC to provide care to residents with various degree of care requirements.",
                    ]}
                    paragraphs={[
                        <span>
                            Our new home will be a place of{" "}
                            <strong className="font-semibold text-primary">
                                comfort and dignity
                            </strong>
                            . We are building a{" "}
                            <strong className="font-semibold text-primary">
                                modern 45-bed facility
                            </strong>
                            . Most rooms will be single en-suite rooms. There
                            will be{" "}
                            <strong className="font-semibold text-primary">
                                39 single rooms and 3 double rooms
                            </strong>
                            . Every resident will have{" "}
                            <strong className="font-semibold text-primary">
                                privacy and independence
                            </strong>
                            .
                        </span>,
                        <span>
                            The home will have{" "}
                            <strong className="font-semibold text-primary">
                                wide, open corridors
                            </strong>
                            . It will have{" "}
                            <strong className="font-semibold text-primary">
                                thoughtful accessibility features
                            </strong>
                            . Lifts will be accomodated for hospital beds to
                            ensure easy movement throughout the home.
                        </span>,
                        <span>
                            Positive ageing will be encouraged at CCC and
                            residents will be{" "}
                            <strong className="font-semibold text-primary">
                                active and connected
                            </strong>
                            . Residents will have a dedicated{" "}
                            <strong className="font-semibold text-primary">
                                Education Room
                            </strong>
                            . There will be a{" "}
                            <strong className="font-semibold text-primary">
                                Rehabilitation Room
                            </strong>
                            . Each floor will have cozy pantries and shared
                            spaces. Our living and dining areas will have open
                            view onto our{" "}
                            <strong className="font-semibold text-primary">
                                green outdoor gardens
                            </strong>{" "}
                            and family and friends are always welcome, spending
                            time with our residents in this relaxing
                            environment.
                        </span>,
                        <span>
                            <strong className="font-semibold text-primary">
                                Care and safety
                            </strong>{" "}
                            are very important. Special{" "}
                            <strong className="font-semibold text-primary">
                                secure sections
                            </strong>{" "}
                            which will provide a safe place for residents with
                            memory care needs. Ground-floor rooms will have{" "}
                            <strong className="font-semibold text-primary">
                                easy access to our peaceful gardens
                            </strong>
                            .
                        </span>,
                        <span>
                            The building has been designed to be{" "}
                            <strong className="font-semibold text-primary">
                                connected to nature
                            </strong>{" "}
                            . This concept was inspired by our existing garden.
                            The garden will continue to be a focus of our daily
                            life and will include{" "}
                            <strong className="font-semibold text-primary">
                                a new aromatic sensory garden
                            </strong>{" "}
                            .
                        </span>,
                    ]}
                    quotes={[
                        {
                            text: "The site has such a nice environment, there is such calmness there in the context of Hong Kong, so I try to capture that calmness, that quietness, this landscape, the garden space – the greenery is very precious. I want to integrate all that into the building. For some of the residents who are on the first or second floor, even if they have limited mobility and can't go down into the garden itself, the design means that they will feel they are in the garden,",
                            author: "Billy Tam, Lead Architect",
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
                    title="Where are CCC's residents now?"
                    paragraphs={[
                        "During redevelopment, CCC is not operating a residential care home at 63 Cumberland Road. Our former residents have been relocated to alternative accommodation, and CCC remain in close contact with them and their families.",
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
                    ]}
                    teamActivities={[
                        "Keeps in touch with former residents and Community Members.",
                        "Organises social, recreational and seasonal events.",
                        "Helps reduce isolation by keeping in connections within the CCC community.",
                    ]}
                    closingParagraph="Our motto, 'Proud to care', continues to guide every decision we make, including how we manage this transition period."
                />

                {/* Section 7: Governance & professional team */}
                <GovernanceTeamSection
                    title="How the project is governed"
                    introText="The redevelopment is overseen by CCC's volunteer Executive Committee and Management Committee, with a dedicated Project Management Committee providing specialist oversight."
                    projectManagerName="Ms Tiffany Wong"
                    projectManagerJoinedDate="July 2025"
                />

                {/* Section 8: How you can support */}
                <HowToSupportSection
                    title="How you can support the redevelopment"
                    paragraphs={[
                        "Redeveloping our home is a major undertaking for a small charity. We are deeply grateful to the individuals, families, companies and foundations who are helping to make it possible.",
                    ]}
                    supportOptions={[
                        "Making a donation to help fund the redevelopment and our ongoing outreach to elders.",
                        "Partnering with CCC through corporate or foundation giving.",
                        "Helping to spread the word about CCC within the English-speaking Hong Kong community.",
                    ]}
                />

                {/* Section 9: Image Gallery */}
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
