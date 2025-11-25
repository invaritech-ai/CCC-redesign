import { Card, CardContent } from "@/components/ui/card";
import { FileText, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Report {
  _id: string;
  title: string;
  year?: string | number;
  slug?: {
    current: string;
  };
}

interface AnnualReportsSectionProps {
  title: string;
  latestReport: Report | null;
  loading?: boolean;
  reportsPageLink?: string;
}

export const AnnualReportsSection = ({
  title,
  latestReport,
  loading = false,
  reportsPageLink = "/who-we-are/publications/annual-reports",
}: AnnualReportsSectionProps) => {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">{title}</h2>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-base md:text-lg text-foreground">Loading reports...</p>
            </div>
          ) : latestReport ? (
            <div className="space-y-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      {latestReport.year && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-base font-semibold text-muted-foreground">
                            {latestReport.year}
                          </span>
                        </div>
                      )}
                      <h3 className="text-lg md:text-xl font-semibold mb-2 text-foreground">
                        {latestReport.title}
                      </h3>
                      {latestReport.slug?.current && (
                        <Link
                          to={`/who-we-are/publications/annual-reports/${latestReport.slug.current}`}
                          className="inline-flex items-center text-base text-primary hover:underline min-h-[44px]"
                        >
                          View report{" "}
                          <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="text-center">
                <Link
                  to={reportsPageLink}
                  className="inline-flex items-center text-base font-semibold text-primary hover:underline min-h-[44px]"
                >
                  View all annual reports{" "}
                  <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-base md:text-lg text-foreground">
                No reports available at this time. Check back soon!
              </p>
              <Link
                to={reportsPageLink}
                className="inline-flex items-center text-base font-semibold text-primary hover:underline mt-4 min-h-[44px]"
              >
                Visit Reports Page{" "}
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

