import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PageContent } from "@/components/PageContent";
import { DynamicForm } from "@/components/DynamicForm";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPageContent, getFormByPage } from "@/lib/sanity.queries";
import type { SanityPageContent, SanityFormBuilder } from "@/lib/sanity.types";
import { applySeo, getCanonicalUrl, getPublicPathForPageSlug } from "@/lib/seo";

const SupportDonate = () => {
  const [pageContent, setPageContent] = useState<SanityPageContent | null>(null);
  const [formConfig, setFormConfig] = useState<SanityFormBuilder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [content, form] = await Promise.all([
          getPageContent("support/donate"),
          getFormByPage("support/donate"),
        ]);
        
        setPageContent(content);
        setFormConfig(form);
      } catch (error) {
        console.error("Error fetching donate page content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update SEO meta tags when pageContent is loaded
  useEffect(() => {
    if (!pageContent) return;

    const baseTitle = "China Coast Community";
    const pageTitle = pageContent.heading 
      ? `${pageContent.heading} | ${baseTitle}`
      : `Donate | ${baseTitle}`;
    
    const description = pageContent.subheading || 
      "Support China Coast Community and help us care for Hong Kong's English-speaking elderly.";
    
    applySeo({
      title: pageTitle,
      description,
      url: getCanonicalUrl(getPublicPathForPageSlug("support/donate")),
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
        {pageContent ? (
          <PageContent
            heading={pageContent.heading}
            subheading={pageContent.subheading}
            content={pageContent.content}
            badgeText={pageContent.badgeText}
            pageSlug="support/donate"
          />
        ) : (
          <section className="bg-primary text-primary-foreground py-12 md:py-0 md:min-h-screen md:flex md:items-center">
            <div className="container mx-auto px-4 w-full">
              <div className="max-w-4xl md:mx-auto md:text-center">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  Donate
                </h1>
                <p className="text-lg md:text-xl max-w-3xl leading-relaxed opacity-90 md:mx-auto">
                  Support China Coast Community and help us care for Hong Kong's English-speaking elderly.
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="py-8 md:py-10 bg-muted/40">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-3">
              <h2 className="text-xl md:text-2xl font-semibold">
                Our Major Donors
              </h2>
              <p className="text-muted-foreground">
                We are deeply grateful to the individuals and organisations whose
                generosity sustains China Coast Community.
              </p>
              <Link
                to="/donate/major-donors"
                className="inline-flex items-center justify-center rounded-full border border-primary px-5 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                View the list of major donors
              </Link>
            </div>
          </div>
        </section>

        {formConfig && (
          <section id="donation-form">
            <DynamicForm formConfig={formConfig} />
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SupportDonate;
