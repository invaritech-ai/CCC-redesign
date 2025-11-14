import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useEffect, useState } from "react";
import { getAllReports } from "@/lib/sanity.queries";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FileText, ArrowRight, Download } from "lucide-react";

const Reports = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      const data = await getAllReports();
      setReports(data);
      setLoading(false);
    };
    fetchReports();
  }, []);

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
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading reports...</p>
              </div>
            ) : reports.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {reports.map((report) => (
                  <Card key={report._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {report.imageUrl && (
                      <img
                        src={report.imageUrl}
                        alt={report.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <span className="text-sm font-semibold text-muted-foreground">
                          {report.year}
                        </span>
                      </div>
                      <h2 className="text-xl font-semibold mb-2">{report.title}</h2>
                      {report.description && (
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {report.description}
                        </p>
                      )}
                      <div className="flex gap-2">
                        {report.slug?.current && (
                          <Link
                            to={`/reports/${report.slug.current}`}
                            className="inline-flex items-center text-primary hover:underline text-sm"
                          >
                            View details <ArrowRight className="ml-1 h-4 w-4" />
                          </Link>
                        )}
                        {report.pdfUrl && (
                          <a
                            href={report.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-primary hover:underline text-sm ml-auto"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download PDF
                          </a>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="max-w-4xl mx-auto text-center py-12">
                <p className="text-lg text-muted-foreground">
                  No reports available at this time. Check back soon!
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Reports;

