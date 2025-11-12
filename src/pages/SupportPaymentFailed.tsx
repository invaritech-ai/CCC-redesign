import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const SupportPaymentFailed = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <section className="bg-destructive/10 text-destructive py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <XCircle className="h-16 w-16 mx-auto mb-6 text-destructive" />
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Payment Failed</h1>
              <p className="text-xl opacity-90">
                We encountered an issue processing your payment.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-lg text-muted-foreground mb-8">
                Please try again or contact us if the problem persists.
              </p>
              <Button asChild>
                <Link to="/support/donate">Try Again</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SupportPaymentFailed;

