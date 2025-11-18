import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { DynamicForm } from "@/components/DynamicForm";
import { useEffect, useState } from "react";
import { getLatestUpdates, getFormByPage } from "@/lib/sanity.queries";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { getImageUrl } from "@/lib/sanityImage";
import type { SanityUpdate, SanityFormBuilder } from "@/lib/sanity.types";

const Updates = () => {
    const [updates, setUpdates] = useState<SanityUpdate[]>([]);
    const [formConfig, setFormConfig] = useState<SanityFormBuilder | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const [updatesData, form] = await Promise.all([
                getLatestUpdates(10),
                getFormByPage("updates"),
            ]);
            setUpdates(updatesData);
            setFormConfig(form);
            setLoading(false);
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />

            <main className="flex-1">
                <section className="bg-primary text-primary-foreground py-20">
                    <div className="container mx-auto px-4">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Updates
                        </h1>
                        <p className="text-xl max-w-3xl opacity-90">
                            Latest news, announcements, and updates from China
                            Coast Community.
                        </p>
                    </div>
                </section>

                <section className="py-16">
                    <div className="container mx-auto px-4">
                        {loading ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">
                                    Loading updates...
                                </p>
                            </div>
                        ) : updates.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                                {updates.map((update) => (
                                    <Card
                                        key={update._id}
                                        className="overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        {update.image && (
                                            <img
                                                src={
                                                    getImageUrl(update.image, {
                                                        width: 800,
                                                        height: 400,
                                                        format: "webp",
                                                    }) || ""
                                                }
                                                alt={update.title}
                                                className="w-full h-48 object-cover"
                                                width="800"
                                                height="400"
                                            />
                                        )}
                                        <div className="p-6">
                                            {update.featured && (
                                                <Badge
                                                    variant="default"
                                                    className="mb-3"
                                                >
                                                    Featured
                                                </Badge>
                                            )}
                                            <h2 className="text-xl font-semibold mb-2">
                                                {update.title}
                                            </h2>
                                            <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                                                <Calendar
                                                    className="h-4 w-4"
                                                    aria-hidden="true"
                                                />
                                                <span>
                                                    {format(
                                                        new Date(
                                                            update.publishedAt
                                                        ),
                                                        "PPP"
                                                    )}
                                                </span>
                                            </div>
                                            {update.excerpt && (
                                                <p className="text-muted-foreground mb-4 line-clamp-3">
                                                    {update.excerpt}
                                                </p>
                                            )}
                                            <Link
                                                to={`/updates/${update.slug?.current}`}
                                                className="inline-flex items-center text-primary hover:underline"
                                                aria-label={`Read more about ${update.title}`}
                                            >
                                                Read more{" "}
                                                <ArrowRight
                                                    className="ml-1 h-4 w-4"
                                                    aria-hidden="true"
                                                />
                                            </Link>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="max-w-4xl mx-auto text-center py-12">
                                <p className="text-lg text-muted-foreground">
                                    No updates available at this time. Check
                                    back soon!
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                {formConfig && <DynamicForm formConfig={formConfig} />}
            </main>

            <Footer />
        </div>
    );
};

export default Updates;
