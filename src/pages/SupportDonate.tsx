import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const SupportDonate = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Donate</h1>
            <p className="text-xl max-w-3xl opacity-90">
              Support China Coast Community and help us care for Hong Kong's English-speaking elderly.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-muted-foreground">
                Donation form and payment integration coming soon.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SupportDonate;

