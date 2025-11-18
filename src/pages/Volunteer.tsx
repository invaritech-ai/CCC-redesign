import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { DynamicForm } from "@/components/DynamicForm";
import { useEffect, useState } from "react";
import { getFormByPage } from "@/lib/sanity.queries";
import type { SanityFormBuilder } from "@/lib/sanity.types";

const Volunteer = () => {
  const [formConfig, setFormConfig] = useState<SanityFormBuilder | null>(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const form = await getFormByPage("volunteer");
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
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Volunteer</h1>
            <p className="text-xl max-w-3xl opacity-90">
              Opportunities for time donors and volunteers.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-muted-foreground">
                Volunteer opportunities coming soon.
              </p>
            </div>
          </div>
        </section>

        {formConfig && <DynamicForm formConfig={formConfig} />}
      </main>

      <Footer />
    </div>
  );
};

export default Volunteer;

