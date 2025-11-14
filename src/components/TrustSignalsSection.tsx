import {
    Award,
    Shield,
    FileText,
    ExternalLink,
    CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getAllPartners } from "@/lib/sanity.queries";
import { getImageUrl } from "@/lib/sanityImage";
import type { SanityPartner } from "@/lib/sanity.types";

interface Partner extends SanityPartner {
    website?: string;
    partnershipType?: string;
    contactInfo?: {
        email?: string;
        phone?: string;
        address?: string;
    };
    order?: number;
}

export const TrustSignalsSection = () => {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPartners = async () => {
            const data = await getAllPartners();
            setPartners(data);
            setLoading(false);
        };
        fetchPartners();
    }, []);

    const accreditations = [
        {
            icon: Award,
            label: "Section 88 Charity",
            description:
                "Registered under Section 88 of the Inland Revenue Ordinance",
        },
        {
            icon: Shield,
            label: "Licensed Care Home",
            description:
                "Licensed Care & Attention Home by Social Welfare Department",
        },
        {
            icon: FileText,
            label: "Financial Transparency",
            description:
                "Annual reports and financial statements publicly available",
        },
        {
            icon: CheckCircle,
            label: "Licensed Care & Attention Home",
            description:
                "Licensed Care & Attention Home by Social Welfare Department",
        },
    ];

    return (
        <section className="py-12 md:py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8 md:mb-12">
                    <h2 className="text-3xl md:text-4xl text-foreground mb-4">
                        Trusted & Accredited
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Our commitment to transparency, accreditation, and
                        community partnerships
                    </p>
                </div>

                {/* Accreditations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
                    {accreditations.map((accreditation, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center text-center p-6 rounded-lg border bg-card"
                        >
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <accreditation.icon className="h-6 w-6 text-primary" />
                            </div>
                            <Badge variant="default" className="mb-2">
                                {accreditation.label}
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-2">
                                {accreditation.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Partner Logos */}
                {!loading && partners.length > 0 && (
                    <div className="mb-12">
                        <h3 className="text-xl font-semibold text-foreground text-center mb-8">
                            Our Partners & Supporters
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 items-center justify-items-center">
                            {partners.map((partner) => (
                                <a
                                    key={partner._id}
                                    href={partner.website || "#"}
                                    target={
                                        partner.website ? "_blank" : undefined
                                    }
                                    rel={
                                        partner.website
                                            ? "noopener noreferrer"
                                            : undefined
                                    }
                                    className="flex items-center justify-center h-20 w-full opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                                >
                                    {partner.logo ? (
                                        <img
                                            src={
                                                getImageUrl(partner.logo, {
                                                    width: 64,
                                                    height: 64,
                                                    format: "webp",
                                                }) || ""
                                            }
                                            alt={partner.name}
                                            className="max-h-16 max-w-full object-contain"
                                            width="64"
                                            height="64"
                                        />
                                    ) : (
                                        <span className="text-muted-foreground">
                                            {partner.name}
                                        </span>
                                    )}
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Transparency Note */}
                <div className="max-w-3xl mx-auto">
                    <div className="p-6 rounded-lg border bg-secondary/30 text-center">
                        <p className="text-foreground mb-4">
                            We believe in transparency and accountability. View
                            our annual reports, financial statements, and impact
                            metrics to see how your support makes a difference.
                        </p>
                        <Button variant="outline" asChild>
                            <Link to="/reports">
                                View Reports & Financials
                                <ExternalLink className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};
