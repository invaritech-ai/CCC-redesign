import { Link } from "react-router-dom";

export type RelatedContentLink = { title: string; to: string };

type Props = {
    title?: string;
    links: RelatedContentLink[];
    className?: string;
};

export function RelatedContentLinks({
    title = "More to explore",
    links,
    className,
}: Props) {
    if (!links.length) return null;

    return (
        <nav
            className={className}
            aria-labelledby="related-content-heading"
        >
            <h2
                id="related-content-heading"
                className="text-lg font-semibold mb-4 text-foreground"
            >
                {title}
            </h2>
            <ul className="space-y-2 list-none pl-0">
                {links.map((link) => (
                    <li key={`${link.to}-${link.title}`}>
                        <Link
                            to={link.to}
                            className="text-primary hover:underline font-medium"
                        >
                            {link.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

type CtaProps = {
    className?: string;
};

/** Static internal CTAs for key conversion pages (always crawlable). */
export function SupportCtaLinks({ className }: CtaProps) {
    return (
        <div className={className}>
            <p className="text-sm font-medium text-muted-foreground mb-2">
                Support CCC
            </p>
            <ul className="flex flex-wrap gap-x-4 gap-y-2 list-none pl-0 text-sm">
                <li>
                    <Link to="/donate" className="text-primary hover:underline">
                        Donate
                    </Link>
                </li>
                <li>
                    <Link
                        to="/get-involved/volunteer"
                        className="text-primary hover:underline"
                    >
                        Volunteer
                    </Link>
                </li>
                <li>
                    <Link to="/contact" className="text-primary hover:underline">
                        Contact
                    </Link>
                </li>
            </ul>
        </div>
    );
}
