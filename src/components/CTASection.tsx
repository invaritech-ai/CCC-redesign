import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DonateNowButton } from "./DonateNowButton";
import { Link } from "react-router-dom";

export const CTASection = () => {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-primary/10 via-secondary/30 to-success/10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6 md:space-y-8">
          <h2 className="text-3xl md:text-4xl text-foreground">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-foreground leading-relaxed">
            Your support today helps us build tomorrow's caring community. Join us in creating a modern, welcoming home for Hong Kong's elderly.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <DonateNowButton size="lg" />
            <Button variant="outline" size="lg" className="gap-2" asChild>
              <Link to="/get-involved/volunteer">
                <Mail className="h-5 w-5" aria-hidden="true" />
                Get Involved
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
