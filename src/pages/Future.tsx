import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Target, Lightbulb, TrendingUp, Building } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Future = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Vision for the Future</h1>
            <p className="text-xl max-w-3xl opacity-90">
              Building a brighter tomorrow for Hong Kong's elderly community through innovation, expansion, and enhanced care.
            </p>
          </div>
        </section>

        {/* Vision Statement */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4">2025 and Beyond</Badge>
              <h2 className="text-3xl font-bold mb-6">Where We're Headed</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                As Hong Kong's elderly population continues to grow, so does our commitment to serve. 
                We envision a future where every English-speaking senior has access to comprehensive care, 
                vibrant community connections, and the resources they need to thrive.
              </p>
            </div>
          </div>
        </section>

        {/* Strategic Goals */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Strategic Goals</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center shrink-0">
                      <Building className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Facility Expansion</h3>
                      <p className="text-muted-foreground mb-3">
                        Develop new community centers in underserved districts to reach more seniors across Hong Kong.
                      </p>
                      <Badge variant="neutral">Target: 2026</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center shrink-0">
                      <Lightbulb className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Digital Innovation</h3>
                      <p className="text-muted-foreground mb-3">
                        Launch digital platforms for telehealth consultations and virtual community activities.
                      </p>
                      <Badge variant="neutral">Target: 2025</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center shrink-0">
                      <Target className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Enhanced Programs</h3>
                      <p className="text-muted-foreground mb-3">
                        Expand wellness programs including mental health support and specialized care services.
                      </p>
                      <Badge variant="neutral">Ongoing</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center shrink-0">
                      <TrendingUp className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Community Partnerships</h3>
                      <p className="text-muted-foreground mb-3">
                        Build strategic partnerships with healthcare providers and social service organizations.
                      </p>
                      <Badge variant="neutral">In Progress</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Upcoming Initiatives */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Upcoming Initiatives</h2>
              <div className="space-y-6">
                <div className="border-l-4 border-success pl-6 py-2">
                  <h3 className="text-xl font-semibold mb-2">Memory Care Program Launch</h3>
                  <p className="text-muted-foreground">
                    A specialized program designed to support members experiencing cognitive decline, 
                    featuring trained staff and tailored activities. Expected launch: Q2 2025.
                  </p>
                </div>
                
                <div className="border-l-4 border-success pl-6 py-2">
                  <h3 className="text-xl font-semibold mb-2">Volunteer Training Academy</h3>
                  <p className="text-muted-foreground">
                    Comprehensive training program to equip volunteers with skills in elderly care, 
                    communication, and emergency response. Rolling admissions starting 2025.
                  </p>
                </div>
                
                <div className="border-l-4 border-success pl-6 py-2">
                  <h3 className="text-xl font-semibold mb-2">Transportation Service Expansion</h3>
                  <p className="text-muted-foreground">
                    Additional shuttle services to help members access medical appointments, shopping, 
                    and community events with ease.
                  </p>
                </div>
                
                <div className="border-l-4 border-success pl-6 py-2">
                  <h3 className="text-xl font-semibold mb-2">Intergenerational Programs</h3>
                  <p className="text-muted-foreground">
                    Connecting seniors with local schools and youth organizations for mentorship, 
                    cultural exchange, and mutual learning opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Help Shape Our Future</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Your support enables us to turn these plans into reality. Join us in building 
              a better future for Hong Kong's elderly community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Partner With Us
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Learn More About Our Plans
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Future;
