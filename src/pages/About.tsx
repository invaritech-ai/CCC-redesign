import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Heart, Users, Calendar, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About China Coast Community</h1>
            <p className="text-xl max-w-3xl opacity-90">
              Providing compassionate care and community support for Hong Kong's English-speaking elderly since 1978.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-center">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                China Coast Community was established to provide a caring, supportive environment for elderly English-speaking 
                residents of Hong Kong. We believe that every senior deserves to live with dignity, surrounded by friends, 
                and with access to quality care and meaningful activities.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our community serves as a vital lifeline for seniors who may face isolation due to language barriers, 
                offering them a place where they can connect with others who share their culture and experiences.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Core Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Heart className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Compassion</h3>
                    <p className="text-muted-foreground">
                      Treating every individual with kindness, empathy, and respect.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Community</h3>
                    <p className="text-muted-foreground">
                      Building connections and fostering a sense of belonging for all.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Award className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Excellence</h3>
                    <p className="text-muted-foreground">
                      Providing the highest quality care and services to our members.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Calendar className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Engagement</h3>
                    <p className="text-muted-foreground">
                      Creating meaningful activities that enrich the lives of seniors.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* History Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-center">Our History</h2>
              <div className="space-y-6 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  Founded in 1978, China Coast Community emerged from a recognized need to support Hong Kong's 
                  English-speaking elderly population. What began as a small gathering has grown into a thriving 
                  community organization serving hundreds of seniors across Hong Kong.
                </p>
                <p className="text-lg leading-relaxed">
                  Over the decades, we have expanded our services to include health programs, social activities, 
                  volunteer coordination, and essential support services. Our community center has become a 
                  second home for many members, offering a warm, welcoming environment where lasting friendships 
                  are formed.
                </p>
                <p className="text-lg leading-relaxed">
                  Today, China Coast Community stands as a testament to the power of community care, supported 
                  by dedicated volunteers, generous donors, and passionate staff members who share our vision 
                  of dignified aging for all.
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

export default About;
