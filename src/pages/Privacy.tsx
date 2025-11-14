import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl max-w-3xl opacity-90">
              How we collect, use, and protect your personal information.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="prose prose-lg max-w-none">
                <h2 className="text-3xl font-bold mb-4">Cookie Usage</h2>
                <p className="text-lg text-foreground mb-4">
                  We use cookies from Sanity CDN (Content Delivery Network) to deliver
                  images and cached content on our website. These cookies help improve
                  your browsing experience by:
                </p>
                <ul className="list-disc list-inside space-y-2 text-lg text-foreground mb-6 ml-4">
                  <li>Loading images and content faster</li>
                  <li>Reducing the amount of data transferred</li>
                  <li>Improving overall website performance</li>
                </ul>
                <p className="text-lg text-foreground mb-4">
                  The cookies used (specifically the <strong>sanitySession</strong> cookie)
                  are necessary for content delivery and do not store any personal
                  information. They are used solely for technical purposes to optimize
                  how content is served to your device.
                </p>
                <p className="text-lg text-foreground">
                  These cookies are essential for the website to function properly and
                  cannot be disabled. By using our website, you acknowledge that these
                  technical cookies are being used.
                </p>
              </div>

              <div className="prose prose-lg max-w-none pt-8 border-t border-border">
                <h2 className="text-3xl font-bold mb-4">Your Privacy</h2>
                <p className="text-lg text-muted-foreground">
                  We are committed to protecting your privacy. The cookies we use are
                  technical in nature and do not track your personal information or
                  browsing behavior across other websites.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;

