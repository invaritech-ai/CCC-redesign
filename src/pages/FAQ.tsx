import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PageContent } from "@/components/PageContent";
import { DynamicForm } from "@/components/DynamicForm";
import { PortableText } from "@/components/PortableText";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import {
    getPageContent,
    getFormByPage,
    getAllFAQs,
} from "@/lib/sanity.queries";
import type {
    SanityPageContent,
    SanityFormBuilder,
    SanityFAQ,
} from "@/lib/sanity.types";
import { applySeo, getCanonicalUrl, serializeJsonLd } from "@/lib/seo";

const faqAnswerToText = (answer: SanityFAQ["answer"]) => {
    if (!Array.isArray(answer)) {
        return "";
    }

    return answer
        .map((block) =>
            block._type === "block"
                ? block.children?.map((child) => child.text ?? "").join(" ")
                : ""
        )
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
};

const FAQ = () => {
    const [pageContent, setPageContent] =
        useState<SanityPageContent | null>(null);
    const [faqs, setFaqs] = useState<SanityFAQ[]>([]);
    const [formConfig, setFormConfig] = useState<SanityFormBuilder | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const faqSchema =
        faqs.length > 0
            ? {
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: faqs.map((faq) => ({
                      "@type": "Question",
                      name: faq.question,
                      acceptedAnswer: {
                          "@type": "Answer",
                          text: faqAnswerToText(faq.answer),
                      },
                  })),
              }
            : null;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [content, faqsData, form] = await Promise.all([
                    getPageContent("care-community/faqs"),
                    getAllFAQs(),
                    getFormByPage("care-community/faqs"),
                ]);

                setPageContent(content);
                setFaqs(faqsData);
                setFormConfig(form);
            } catch (error) {
                console.error("[FAQ] Error fetching page data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const pageTitle = pageContent?.heading
            ? `${pageContent.heading} | China Coast Community`
            : "Frequently Asked Questions | China Coast Community";
        const description =
            pageContent?.subheading ||
            "Frequently asked questions about China Coast Community services and programs.";

        applySeo({
            title: pageTitle,
            description,
            url: getCanonicalUrl("/care-community/faqs"),
        });

        return () => applySeo();
    }, [pageContent]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navigation />
                <main className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />

            <main id="main-content" className="flex-1">
                {faqSchema && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: serializeJsonLd(faqSchema),
                        }}
                    />
                )}
                {/* Render page content from CMS if available */}
                {pageContent ? (
                    <PageContent
                        heading={pageContent.heading}
                        subheading={pageContent.subheading}
                        content={pageContent.content}
                        badgeText={pageContent.badgeText}
                        heroImage={pageContent.heroImage}
                        bottomImages={pageContent.bottomImages}
                    />
                ) : (
                    <section className="bg-primary text-primary-foreground py-12 md:py-0 md:min-h-screen md:flex md:items-center">
                        <div className="container mx-auto px-4 w-full">
                            <div className="max-w-4xl md:mx-auto md:text-center">
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                                    FAQs
                                </h1>
                                <p className="text-lg md:text-xl max-w-3xl leading-relaxed opacity-90 md:mx-auto">
                                    Frequently Asked Questions
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                {/* Render FAQs from CMS if available */}
                {faqs.length > 0 && (
                    <section className="py-12 md:py-20">
                        <div className="container mx-auto px-4">
                            <div className="max-w-4xl mx-auto">
                                <Accordion type="single" collapsible className="w-full">
                                    {faqs.map((faq) => (
                                        <AccordionItem
                                            key={faq._id}
                                            value={faq._id}
                                        >
                                            <AccordionTrigger className="text-left">
                                                {faq.question}
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="pt-2">
                                                    <PortableText blocks={faq.answer ?? []} />
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        </div>
                    </section>
                )}

                {/* Render form from CMS if available */}
                {formConfig && <DynamicForm formConfig={formConfig} />}
            </main>

            <Footer />
        </div>
    );
};

export default FAQ;

