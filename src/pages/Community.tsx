import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PageContent } from "@/components/PageContent";
import { DynamicForm } from "@/components/DynamicForm";
import { useEffect, useState } from "react";
import { getPageContent, getFormByPage } from "@/lib/sanity.queries";
import type { SanityPageContent, SanityFormBuilder } from "@/lib/sanity.types";
import { applySeo, getCanonicalUrl } from "@/lib/seo";

const Community = () => {
  const [pageContent, setPageContent] = useState<SanityPageContent | null>(null);
  const [formConfig, setFormConfig] = useState<SanityFormBuilder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [content, form] = await Promise.all([
          getPageContent("care-community/community-members-programme"),
          getFormByPage("care-community/community-members-programme"),
        ]);
        
        setPageContent(content);
        setFormConfig(form);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const pageTitle = pageContent?.heading
      ? `${pageContent.heading} | China Coast Community`
      : "Community Members Programme | China Coast Community";
    const description = pageContent?.subheading ||
      "Connect with CCC members, participate in activities, and learn about residency opportunities at our new building.";

    applySeo({
      title: pageTitle,
      description,
      url: getCanonicalUrl("/care-community/community-members-programme"),
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
          />
        ) : (
          <section className="bg-primary text-primary-foreground py-12 md:py-0 md:min-h-screen md:flex md:items-center">
            <div className="container mx-auto px-4 w-full">
              <div className="max-w-4xl md:mx-auto md:text-center">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  Community
                </h1>
                <p className="text-lg md:text-xl max-w-3xl leading-relaxed opacity-90 md:mx-auto">
                  Information for elderly community members and event links.
                </p>
              </div>
            </div>
          </section>
        )}

        {formConfig && <DynamicForm formConfig={formConfig} />}
      </main>

      <Footer />
    </div>
  );
};

export default Community;

