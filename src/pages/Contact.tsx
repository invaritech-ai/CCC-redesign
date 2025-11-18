import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { DynamicForm } from "@/components/DynamicForm";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getFormByPage } from "@/lib/sanity.queries";
import type { SanityFormBuilder } from "@/lib/sanity.types";

const Contact = () => {
  const [formConfig, setFormConfig] = useState<SanityFormBuilder | null>(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const form = await getFormByPage("contact");
        setFormConfig(form);
      } catch (error) {
        // Silently fail if form doesn't exist
      }
    };
    fetchForm();
  }, []);
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-12 md:py-0 md:min-h-screen md:flex md:items-center">
          <div className="container mx-auto px-4 w-full">
            <div className="max-w-4xl md:mx-auto md:text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Get in Touch
              </h1>
              <p className="text-lg md:text-xl max-w-3xl leading-relaxed opacity-90 md:mx-auto">
                We'd love to hear from you. Whether you're interested in our services, want to volunteer, or have questions, reach out to us.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Form */}
              <div>
                {formConfig ? (
                  <DynamicForm formConfig={formConfig} inline />
                ) : (
                  <div>
                    <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
                    <p className="text-muted-foreground">Loading form...</p>
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
                  <p className="text-muted-foreground mb-8">
                    Our team is here to help you with any inquiries about our services, 
                    programs, or how you can get involved with China Coast Community.
                  </p>
                </div>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex gap-4 items-start">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <MapPin className="h-6 w-6 text-primary" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Office Address</h3>
                        <p className="text-muted-foreground">
                          123 Victoria Road<br />
                          Central, Hong Kong
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex gap-4 items-start">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <Phone className="h-6 w-6 text-primary" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Phone</h3>
                        <p className="text-muted-foreground">
                          +852 1234 5678<br />
                          +852 9876 5432 (Mobile)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex gap-4 items-start">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <Mail className="h-6 w-6 text-primary" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Email</h3>
                        <p className="text-muted-foreground">
                          info@chinacoastcommunity.org<br />
                          volunteer@chinacoastcommunity.org
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex gap-4 items-start">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <Clock className="h-6 w-6 text-primary" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Office Hours</h3>
                        <p className="text-muted-foreground">
                          Monday - Friday: 9:00 AM - 5:00 PM<br />
                          Saturday: 10:00 AM - 2:00 PM<br />
                          Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Emergency Contact */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Emergency Contact</h2>
              <p className="text-lg text-muted-foreground mb-6">
                For urgent matters requiring immediate attention, please contact our emergency hotline:
              </p>
              <a href="tel:+85298765432" className="text-3xl font-bold text-foreground hover:text-primary transition-colors">
                +852 9876 5432
              </a>
              <p className="text-sm text-muted-foreground mt-4">
                Available 24/7 for members and their families
              </p>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Visit Our Center</h2>
            <div className="max-w-5xl mx-auto">
              <div className="bg-muted rounded-lg overflow-hidden" style={{ height: '400px' }}>
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" aria-hidden="true" />
                    <p>Interactive map would be displayed here</p>
                    <p className="text-sm mt-2">123 Victoria Road, Central, Hong Kong</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Button variant="outline" size="lg">
                  Get Directions
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
