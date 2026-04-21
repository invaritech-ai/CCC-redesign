import { Link } from "react-router-dom";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { BreadcrumbItem as Item } from "@/lib/internalNav";

type Props = {
    items: Item[];
    className?: string;
};

export function PageBreadcrumbs({ items, className }: Props) {
    if (!items.length) return null;

    return (
        <Breadcrumb className={className}>
            <BreadcrumbList>
                {items.flatMap((item, index) => {
                    const isLast = index === items.length - 1;
                    const keyBase = `${item.label}-${index}`;
                    const nodes = [];
                    if (index > 0) {
                        nodes.push(
                            <BreadcrumbSeparator key={`${keyBase}-sep`} />
                        );
                    }
                    nodes.push(
                        <BreadcrumbItem key={`${keyBase}-item`}>
                            {isLast || !item.href ? (
                                <BreadcrumbPage>{item.label}</BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink asChild>
                                    <Link to={item.href}>{item.label}</Link>
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                    );
                    return nodes;
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
