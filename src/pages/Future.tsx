import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AboutHero } from "@/components/AboutHero";
import { AboutIntroduction } from "@/components/AboutIntroduction";
import { ProjectTimeline } from "@/components/ProjectTimeline";
import { ImageGallery } from "@/components/ImageGallery";
import { UpcomingInitiativesSection } from "@/components/UpcomingInitiativesSection";
import { CTASection } from "@/components/CTASection";
import { DonateNowButton } from "@/components/DonateNowButton";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

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
            src: "/Central Lawn (20230613).webp",
            alt: "Central Lawn area",
        },
        {
            src: "/Entrance (20230613).webp",
            alt: "Entrance area",
        },
        {
            src: "/Flower Arbor (20230613).webp",
            alt: "Flower Arbor",
        },
        {
            src: "/IMG_9752.webp",
            alt: "Project image",
        },
        {
            src: "/isov.webp",
            alt: "Isometric view",
        },
        {
            src: "/planv.webp",
            alt: "Plan view",
        },
        {
            src: "/prep 5.webp",
            alt: "Preparation work",
        },
        {
            src: "/Private Terrace (20230613).webp",
            alt: "Private Terrace",
        },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />

            <main id="main-content" className="flex-1">
                {/* Hero Section */}
                <AboutHero
                    title="Future"
                    description="China Coast Community launches reconstruction project."
                    badgeText="Reconstruction Project"
                />

                {/* Introduction Section */}
                <AboutIntroduction
                    title="Building the Future"
                    paragraphs={[
                        "The China Coast Community (CCC) is launching a long-planned reconstruction project, which will add more beds to the home and make it a state-of-the-art care facility.",
                        "The new 45-bed facility will comprise mostly single rooms with en suite shower rooms, that will allow CCC Residents to live with dignity and in privacy. The 3-storey building will be future-proofed, with foundations supporting an additional floor, if in the future this is permitted.",
                        "One of CCC's aims is to reach out to the elderly who have memory issues and to provide support for their families and carers. CCC is re-vamping a wide range of services and facilities, not only for its Residents but also for CCC Community Members, who will be assisted to remain independently in the community for as long as they can manage. Re-commencing post-Covid, activities and social events will be arranged for Residents and Community Members, including during the period of the redevelopment.",
                        "CCC is the only Residential Care Home for the Elderly in Hong Kong providing services for elderly persons of all nationalities, ethnicities, religions and cultures who are linked by the ability to speak the English language.",
                        "The construction of the new building alone will cost around $HK100 million, and fundraising for the new project is now underway.",
                    ]}
                />

                {/* Donate and Get Involved CTAs */}
                <section className="py-12 md:py-16 bg-secondary/30">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto flex flex-wrap gap-4 justify-center">
                            <DonateNowButton size="lg" />
                            <Button variant="outline" size="lg" className="gap-2" asChild>
                                <Link to="/get-involved/volunteer">
                                    <Mail className="h-5 w-5" aria-hidden="true" />
                                    Get Involved
                                </Link>
                            </Button>
                        </div>
                        <p className="text-center text-muted-foreground mt-4">
                            If you would like to support us, please do get in
                            touch.
                        </p>
                    </div>
                </section>

                {/* The Past Section */}
                <section className="py-12 md:py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                                The Past
                            </h2>
                            <div className="space-y-6">
                                <p className="text-base md:text-lg text-foreground leading-relaxed">
                                    The buildings at 63 Cumberland Road, were
                                    constructed in the 1930s and 1980s. All save
                                    for 2 rooms share communal bathrooms. The
                                    facilities are now out-dated and do not
                                    reflect current standards for elderly care
                                    e.g. the corridors are not wide enough for 2
                                    wheelchairs to pass each other; there is
                                    only one small lift that does not
                                    accommodate a bed; there is a difference in
                                    height between 2 parts of the building,
                                    which is a challenge for Residents with
                                    mobility issues. Matters have become more
                                    acute because, as compared with the
                                    Residents when CCC first opened, the current
                                    profile of CCC Residents is older and
                                    frailer, many being wheelchair or bed-bound.
                                    Moreover, the building and its facilities
                                    have required repeated and costly
                                    renovations and repair.
                                </p>
                                <p className="text-base md:text-lg text-foreground leading-relaxed">
                                    CCC appointed Consultants – Architects,
                                    Structural Engineers, Planners – to carry
                                    out feasibility studies and advise on the
                                    way forward, with the objective that the
                                    elderly be enabled to age-in-place, with
                                    dignity and privacy.
                                </p>
                                <blockquote className="border-l-4 border-primary pl-6 py-2 italic text-base md:text-lg text-foreground">
                                    "After studying the options, CCC's
                                    Consultants advised us that the existing
                                    buildings could not be extensively renovated
                                    to achieve CCC's goal. Reconstruction was
                                    the only feasible way to provide the optimal
                                    services for our residents and the
                                    community. The Consultants also advised that
                                    it was not feasible to re-build with the
                                    residents in situ as it would be too dusty,
                                    too noisy, too disruptive, and potentially
                                    dangerous for them."{" "}
                                    <span className="font-semibold not-italic">
                                        — Corinne Remedios, Chair of CCC's
                                        Executive Committee
                                    </span>
                                </blockquote>
                            </div>
                        </div>
                    </div>
                </section>

                {/* The Future Section */}
                <section className="py-12 md:py-20 bg-secondary/30">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                                The Future
                            </h2>
                            <div className="space-y-6">
                                <p className="text-base md:text-lg text-foreground leading-relaxed">
                                    Key elements of the project include making
                                    sure the new home is more accessible for
                                    residents and more fit for purpose.
                                    Corridors and room doors will be wide enough
                                    to permit a bed to pass through. There will
                                    be 2 lifts, one of which will accommodate a
                                    hospital bed. There will be an Education
                                    Room and a Rehabilitation Room, with an
                                    outdoor hydrotherapy pool. There will be a
                                    pantry and communal areas on each floor. The
                                    Living and Dining Rooms will open onto
                                    outdoor spaces, providing opportunity for
                                    Residents, their families and visitors to
                                    spend quality time together at the Home. On
                                    the first and second floors, some rooms will
                                    be in secure areas, to accommodate Residents
                                    with memory issues who tend to wander. There
                                    will be 3 double rooms to cater for couples.
                                    The rest will be single rooms with en suite
                                    shower rooms, except for 4 single rooms. All
                                    ground floor rooms will have direct access
                                    into the garden.
                                </p>
                                <p className="text-base md:text-lg text-foreground leading-relaxed">
                                    The new design will make full use of the
                                    grounds and will be a mix of communal areas,
                                    residential rooms and garden space, which
                                    the architect has made a key feature of the
                                    design.
                                </p>
                                <blockquote className="border-l-4 border-primary pl-6 py-2 italic text-base md:text-lg text-foreground">
                                    "The site has such a nice environment, there
                                    is such calmness there in the context of
                                    Hong Kong, so I try to capture that
                                    calmness, that quietness, this landscape,
                                    the garden space – the greenery is very
                                    precious. I want to integrate all that into
                                    the building,"{" "}
                                    <span className="font-semibold not-italic">
                                        — Billy Tam, Lead Architect
                                    </span>
                                </blockquote>
                                <blockquote className="border-l-4 border-primary pl-6 py-2 italic text-base md:text-lg text-foreground">
                                    "For some of the residents who are on the
                                    first or second floor, even if they have
                                    limited mobility and can't go down into the
                                    garden itself, the design means that they
                                    will feel they are in the garden,"{" "}
                                    <span className="font-semibold not-italic">
                                        — Billy Tam, Lead Architect
                                    </span>
                                </blockquote>
                                <p className="text-base md:text-lg text-foreground leading-relaxed">
                                    The Architect's General Building Plans have
                                    been submitted and Buildings Department
                                    Approval has been given to demolish and
                                    construct. CCC is currently working with
                                    other Departments to obtain the remaining
                                    consents for the re-development to go ahead.
                                    The pre-construction work is therefore in
                                    its final phase.
                                </p>
                                <p className="text-base md:text-lg text-foreground leading-relaxed">
                                    Once work commences, the new facility should
                                    be completed in two to three years. Funding
                                    is now being sought and your help would be
                                    greatly appreciated.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Project Timeline */}
                <ProjectTimeline phases={timelinePhases} />

                {/* Image Gallery */}
                <ImageGallery
                    images={galleryImages}
                    title="Project Visualizations"
                />

                {/* Upcoming Initiatives */}
                <UpcomingInitiativesSection />

                {/* CTA Section */}
                <CTASection />
            </main>

            <Footer />
        </div>
    );
};

export default Future;
