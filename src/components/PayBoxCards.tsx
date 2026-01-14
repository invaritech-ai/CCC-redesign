import {
    CreditCard,
    Zap,
    HandCoins,
    QrCode,
    Mail,
    Landmark,
} from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type PayBoxLine = {
    plain: string;
    node?: ReactNode;
    hrefs?: string[];
};

export type PayBoxItem = {
    title: string;
    lines: PayBoxLine[];
    images?: Array<{ src: string; alt?: string }>;
};

const getPayBoxMeta = (title: string) => {
    const t = title.toLowerCase();

    if (t.includes("credit")) return { Icon: CreditCard, accent: "text-primary" };
    if (t.includes("fps")) return { Icon: Zap, accent: "text-primary" };
    if (t.includes("fundraise")) return { Icon: HandCoins, accent: "text-primary" };
    if (t.includes("qr") || t.includes("payme"))
        return { Icon: QrCode, accent: "text-primary" };
    if (t.includes("cheque") || t.includes("check"))
        return { Icon: Mail, accent: "text-primary" };
    if (t.includes("bank")) return { Icon: Landmark, accent: "text-primary" };

    return { Icon: Landmark, accent: "text-primary" };
};

const urlRegex = /(https?:\/\/[^\s)]+|www\.[^\s)]+)/gi;
const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

const normalizeHref = (raw: string) => {
    let trimmed = raw.trim();
    trimmed = trimmed.replace(/[),.;:!?'"’”]+$/g, "");
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    if (/^www\./i.test(trimmed)) return `https://${trimmed}`;
    return trimmed;
};

const extractFirstUrl = (value: string): string | null => {
    const match = value.match(urlRegex);
    if (!match || match.length === 0) return null;
    return normalizeHref(match[0]);
};

const linkifyLine = (line: string) => {
    const parts: Array<string | { href: string; label: string }> = [];
    let lastIndex = 0;
    for (const match of line.matchAll(urlRegex)) {
        const index = match.index ?? -1;
        if (index < 0) continue;
        const label = match[0];
        const href = normalizeHref(label);
        if (index > lastIndex) parts.push(line.slice(lastIndex, index));
        parts.push({ href, label });
        lastIndex = index + label.length;
    }
    if (lastIndex < line.length) parts.push(line.slice(lastIndex));

    if (parts.length === 0) return line;

    return parts.map((part, idx) => {
        if (typeof part === "string") return <span key={idx}>{part}</span>;
        return (
            <a
                key={idx}
                href={part.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline break-all font-medium"
            >
                {part.label}
            </a>
        );
    });
};

const splitKeyValue = (line: string): { key: string; value: string } | null => {
    const idx = line.indexOf(":");
    if (idx <= 0) return null;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (!key || !value) return null;
    return { key, value };
};

export const PayBoxCards = ({ items }: { items: PayBoxItem[] }) => {
    if (items.length === 0) return null;

    return (
        <section className="my-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item, idx) => {
                    const { Icon, accent } = getPayBoxMeta(item.title);
                    const normalizedLines = item.lines
                        .map((line) => line.plain.trim())
                        .filter(Boolean);

                    const hasDonateNow = normalizedLines.some(
                        (line) => line.toLowerCase() === "donate now"
                    );

                    const donateNowLine = item.lines.find(
                        (line) => line.plain.trim().toLowerCase() === "donate now"
                    );

                    const contentLines = item.lines.filter(
                        (line) => line.plain.trim().toLowerCase() !== "donate now"
                    );

                    const firstHrefFromMarks =
                        donateNowLine?.hrefs?.find(Boolean) ||
                        contentLines
                            .flatMap((line) => line.hrefs || [])
                            .find(Boolean) ||
                        null;

                    const firstUrl = contentLines
                        .map((line) => extractFirstUrl(line.plain))
                        .find((href): href is string => Boolean(href));

                    const kvPairs: Array<{ key: string; value: string }> = [];
                    const textLines: PayBoxLine[] = [];

                    for (const line of contentLines) {
                        const kv = splitKeyValue(line.plain);
                        if (kv) {
                            kvPairs.push(kv);
                            continue;
                        }
                        textLines.push(line);
                    }

                    const emailLine = textLines.find((line) =>
                        emailRegex.test(line.plain)
                    );
                    const mailtoHref = emailLine
                        ? `mailto:${emailLine.plain.match(emailRegex)?.[0]}`
                        : null;

                    const primaryActionHref = hasDonateNow
                        ? firstHrefFromMarks || firstUrl || "#donation-form"
                        : null;

                    return (
                        <Card
                            key={`${item.title}-${idx}`}
                            className="overflow-hidden border-border/60 bg-card shadow-sm transition-shadow hover:shadow-md"
                        >
                            <CardContent className="p-6">
                                <div className="flex items-start gap-3">
                                    <div
                                        className={cn(
                                            "mt-0.5 rounded-lg bg-primary/10 p-2",
                                            accent
                                        )}
                                    >
                                        <Icon className="h-5 w-5" aria-hidden="true" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-lg font-semibold text-foreground leading-snug">
                                            {item.title}
                                        </h3>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-3">
                                    {textLines.length > 0 && (
                                        <div className="space-y-2">
                                            {textLines.map((line, lineIdx) => {
                                                return (
                                                    <p
                                                        key={lineIdx}
                                                        className="text-sm text-muted-foreground leading-relaxed"
                                                    >
                                                        {line.hrefs &&
                                                        line.hrefs.length > 0 &&
                                                        line.node
                                                            ? line.node
                                                            : linkifyLine(
                                                                  line.plain
                                                              )}
                                                    </p>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {kvPairs.length > 0 && (
                                        <dl className="space-y-2 rounded-lg border border-border/50 bg-secondary/20 p-4">
                                            {kvPairs.map((pair, pairIdx) => (
                                                <div
                                                    key={pairIdx}
                                                    className="grid grid-cols-1 gap-1"
                                                >
                                                    <dt className="text-xs font-semibold text-muted-foreground">
                                                        {pair.key}
                                                    </dt>
                                                    <dd className="text-xs font-medium text-foreground break-words">
                                                        {linkifyLine(pair.value)}
                                                    </dd>
                                                </div>
                                            ))}
                                        </dl>
                                    )}

                                    {item.images && item.images.length > 0 && (
                                        <div className="pt-1">
                                            {item.images.map((image, imageIdx) => (
                                                <div
                                                    key={`${image.src}-${imageIdx}`}
                                                    className="rounded-lg border border-border/50 bg-secondary/10 p-3"
                                                >
                                                    <img
                                                        src={image.src}
                                                        alt={image.alt || item.title}
                                                        className="w-full max-h-64 object-contain rounded-md bg-white/60"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {mailtoHref && (
                                        <div className="pt-1">
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                                asChild
                                            >
                                                <a href={mailtoHref}>Email us</a>
                                            </Button>
                                        </div>
                                    )}

                                    {primaryActionHref && (
                                        <div className="pt-1">
                                            <Button
                                                variant="default"
                                                className="w-full"
                                                asChild
                                            >
                                                <a
                                                    href={primaryActionHref}
                                                    target={
                                                        primaryActionHref.startsWith(
                                                            "http"
                                                        )
                                                            ? "_blank"
                                                            : undefined
                                                    }
                                                    rel={
                                                        primaryActionHref.startsWith(
                                                            "http"
                                                        )
                                                            ? "noopener noreferrer"
                                                            : undefined
                                                    }
                                                >
                                                    Donate now
                                                </a>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </section>
    );
};
