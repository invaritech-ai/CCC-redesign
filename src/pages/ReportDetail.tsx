import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getReportBySlug } from "@/lib/sanity.queries";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getImageUrl, getImageUrlFromString } from "@/lib/sanityImage";
import type { SanityReport } from "@/lib/sanity.types";

const ReportDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const [report, setReport] = useState<SanityReport | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            if (slug) {
                const data = await getReportBySlug(slug);
                setReport(data);
            }
            setLoading(false);
        };
        fetchReport();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navigation />
                <main className="flex-1">
                    <section className="bg-primary text-primary-foreground py-20">
                        <div className="container mx-auto px-4">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                Annual Report
                            </h1>
                        </div>
                    </section>
                    <section className="py-16">
                        <div className="container mx-auto px-4">
                            <div className="max-w-4xl mx-auto">
                                <p className="text-muted-foreground">
                                    Loading...
                                </p>
                            </div>
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
        );
    }

    if (!report) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navigation />
                <main className="flex-1">
                    <section className="bg-primary text-primary-foreground py-20">
                        <div className="container mx-auto px-4">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                Annual Report
                            </h1>
                        </div>
                    </section>
                    <section className="py-16">
                        <div className="container mx-auto px-4">
                            <div className="max-w-4xl mx-auto text-center">
                                <p className="text-lg text-muted-foreground">
                                    Report not found.
                                </p>
                            </div>
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />

            <main className="flex-1">
                <section className="bg-primary text-primary-foreground py-20">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center gap-3 mb-4">
                            <FileText className="h-8 w-8" />
                            <span className="text-2xl font-semibold opacity-90">
                                {report.year}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            {report.title}
                        </h1>
                        {report.author && (
                            <p className="text-xl opacity-90">
                                By {report.author}
                            </p>
                        )}
                    </div>
                </section>

                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            {report.image && (
                                <img
                                    src={
                                        getImageUrl(report.image, {
                                            width: 1200,
                                            height: 600,
                                            format: "webp",
                                        }) || ""
                                    }
                                    alt={report.title}
                                    className="w-full h-96 object-cover rounded-lg mb-8"
                                    width="1200"
                                    height="600"
                                />
                            )}

                            {report.description && (
                                <div className="prose prose-lg max-w-none mb-8">
                                    <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                                        {report.description}
                                    </p>
                                </div>
                            )}

                            {report.pdf && (
                                <Button asChild className="mt-6" size="lg">
                                    <a
                                        href={
                                            getImageUrlFromString(
                                                report.pdf.url
                                            ) || report.pdf.url
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Download
                                            className="mr-2 h-5 w-5"
                                            aria-hidden="true"
                                        />
                                        Download PDF Report
                                    </a>
                                </Button>
                            )}

                            {report.summary && (
                                <div className="mt-8 p-6 bg-secondary/30 rounded-lg">
                                    <h2 className="text-xl font-semibold mb-3">
                                        Summary
                                    </h2>
                                    <p className="text-muted-foreground">
                                        {report.summary}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default ReportDetail;
