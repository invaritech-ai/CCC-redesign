import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const Reports = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Annual Reports</h1>
            <p className="text-xl max-w-3xl opacity-90">
              Transparency and impact reports from China Coast Community.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-muted-foreground">
                Reports index coming soon. This will display annual reports from Sanity CMS.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Reports;

