import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CheckCircle2 } from "lucide-react";

const SupportConfirmation = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <CheckCircle2 className="h-16 w-16 mx-auto mb-6 text-success" />
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Payment Confirmed</h1>
              <p className="text-xl opacity-90">
                Thank you for your generous donation!
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-lg text-muted-foreground">
                Your payment has been successfully processed. We appreciate your support.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SupportConfirmation;

