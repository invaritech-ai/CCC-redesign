import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PageContent } from "@/components/PageContent";
import { DynamicForm } from "@/components/DynamicForm";
import { useEffect, useState } from "react";
import { getPageContent, getFormByPage } from "@/lib/sanity.queries";
import type { SanityPageContent, SanityFormBuilder } from "@/lib/sanity.types";

// Helper function to update meta tags
const updateMetaTag = (name: string, content: string, isProperty = false) => {
  const attribute = isProperty ? "property" : "name";
  let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  
  element.content = content;
};

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
    
    const canonicalUrl = `https://chinacoastcommunity.org/support/donate`;

    // Update title
    document.title = pageTitle;

    // Update meta description
    updateMetaTag("description", description);

    // Update Open Graph tags
    updateMetaTag("og:title", pageTitle, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:url", canonicalUrl, true);
    updateMetaTag("og:type", "website", true);

    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;

    // Cleanup function to restore default meta tags when component unmounts
    return () => {
      document.title = "China Coast Community - Caring for Hong Kong's English-Speaking Elderly";
      updateMetaTag("description", "A caring home for Hong Kong's English-speaking elderly since 1978. Supporting our redevelopment to create a safe, modern community where every senior is valued.");
      updateMetaTag("og:title", "China Coast Community - Caring for Hong Kong's English-Speaking Elderly", true);
      updateMetaTag("og:description", "A caring home for Hong Kong's English-speaking elderly since 1978. Supporting our redevelopment.", true);
      updateMetaTag("og:url", "https://chinacoastcommunity.org/", true);
      if (canonicalLink) {
        canonicalLink.href = "https://chinacoastcommunity.org/";
      }
    };
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
                  Donate
                </h1>
                <p className="text-lg md:text-xl max-w-3xl leading-relaxed opacity-90 md:mx-auto">
                  Support China Coast Community and help us care for Hong Kong's English-speaking elderly.
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

export default SupportDonate;

