import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { DynamicForm } from "@/components/DynamicForm";
import { MapPin, Phone, Mail } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
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
          <div className="container mx-auto px-4">
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
              <div className="min-w-0">
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
              <div className="space-y-6 min-w-0">
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
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold mb-1">Postal Address</h3>
                        <p className="text-muted-foreground break-words">
                          63 Cumberland Road<br />
                          Kowloon Tong, Kowloon, Hong Kong
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
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold mb-1">Phone</h3>
                        <p className="text-muted-foreground break-words">
                          +852 2337 7266
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
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold mb-1">Email</h3>
                        <p className="text-muted-foreground break-words">
                          ccchome@netvigator.com
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <a
                      href="https://wa.me/85261104078"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex gap-4 items-start hover:opacity-80 transition-opacity"
                    >
                      <div className="w-12 h-12 bg-[#25D366]/10 rounded-lg flex items-center justify-center shrink-0">
                        <FaWhatsapp className="h-6 w-6 text-[#25D366]" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">WhatsApp</h3>
                        <p className="text-muted-foreground">
                          +852 6110 4078<br />
                          <span className="text-[#25D366] font-medium">Click to message us</span>
                        </p>
                      </div>
                    </a>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Location of our Care Home (currently under redevelopment)
            </h2>
            <div className="max-w-5xl mx-auto space-y-4">
              <div className="bg-muted rounded-lg overflow-hidden" style={{ height: '400px' }}>
                <iframe
                  title="63 Cumberland Road, Kowloon Tong, Kowloon, Hong Kong"
                  src="https://www.google.com/maps?q=China+Coast+Community+Ltd&ll=22.333109,114.17707&z=17&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                />
              </div>
              <div className="text-center">
                <Button variant="outline" size="lg" asChild>
                  <a
                    href="https://www.google.com/maps/place/China+Coast+Community+Ltd/@22.333109,114.1744897,17z/data=!3m1!4b1!4m6!3m5!1s0x340406dc972cfaff:0x37dd9a2ed78fa79b!8m2!3d22.333109!4d114.17707!16s%2Fg%2F12hm_4k63?entry=ttu&g_ep=EgoyMDI1MTEzMC4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Directions
                  </a>
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
