import type { ReactNode } from "react";
import type {
    SanityPortableTextBlock,
    SanityBlock,
    SanityImageBlock,
} from "@/lib/sanity.types";
import { getImageUrlFromString } from "@/lib/sanityImage";

interface PortableTextProps {
    blocks: SanityPortableTextBlock[];
    className?: string;
}

// Helper function to render text with marks (bold, italic, links, etc.)
const renderTextWithMarks = (
    children: SanityBlock["children"],
    markDefs?: SanityBlock["markDefs"]
) => {
    if (!children) return null;

    // Filter out empty spans and combine text
    const nonEmptyChildren = children.filter(
        (child) => child.text && child.text.trim() !== ""
    );
    if (nonEmptyChildren.length === 0) return null;

    // Render each child with its marks
    return nonEmptyChildren.map((child, index) => {
        let element: ReactNode = child.text;

        // Apply marks (formatting) - process in reverse order for proper nesting
        if (child.marks && child.marks.length > 0) {
            // Process marks in reverse to get proper nesting (outermost first)
            [...child.marks].reverse().forEach((mark) => {
                if (mark === "strong" || mark === "bold") {
                    element = (
                        <strong key={`${index}-strong`}>{element}</strong>
                    );
                } else if (mark === "em" || mark === "italic") {
                    element = <em key={`${index}-em`}>{element}</em>;
                } else if (mark === "underline") {
                    element = <u key={`${index}-u`}>{element}</u>;
                } else if (
                    mark === "strike-through" ||
                    mark === "strikethrough"
                ) {
                    element = <s key={`${index}-s`}>{element}</s>;
                } else if (mark === "code") {
                    element = (
                        <code
                            key={`${index}-code`}
                            className="bg-muted px-1 py-0.5 rounded text-sm font-mono"
                        >
                            {element}
                        </code>
                    );
                } else if (markDefs) {
                    // Handle links - mark is the key that references markDefs
                    const linkDef = markDefs.find((def) => def._key === mark);
                    if (linkDef && linkDef._type === "link" && linkDef.href) {
                        const isExternal = linkDef.href.startsWith("http");
                        element = (
                            <a
                                key={`${index}-link`}
                                href={linkDef.href}
                                target={isExternal ? "_blank" : undefined}
                                rel={
                                    isExternal
                                        ? "noopener noreferrer"
                                        : undefined
                                }
                                className="content-link"
                            >
                                {element}
                            </a>
                        );
                    }
                }
            });
        }

        return <span key={index}>{element}</span>;
    });
};

export const PortableText = ({ blocks, className = "" }: PortableTextProps) => {
    if (!blocks || !Array.isArray(blocks)) return null;

    // Track list state for proper nesting
    let currentListType: "bullet" | "number" | null = null;
    let listItems: ReactNode[] = [];
    const elements: ReactNode[] = [];

    const flushList = () => {
        if (listItems.length > 0) {
            const ListTag = currentListType === "number" ? "ol" : "ul";
            const listClassName =
                currentListType === "number"
                    ? "list-decimal list-inside space-y-2 mb-4 ml-4"
                    : "list-disc list-inside space-y-2 mb-4 ml-4";
            elements.push(
                <ListTag
                    key={`list-${elements.length}`}
                    className={listClassName}
                >
                    {listItems}
                </ListTag>
            );
            listItems = [];
            currentListType = null;
        }
    };

    blocks.forEach((block, index) => {
        // Handle image blocks
        if (block._type === "image") {
            flushList();
            const imageBlock = block as SanityImageBlock;
            if (imageBlock.asset?.url) {
                const imageUrl = getImageUrlFromString(imageBlock.asset.url);
                if (imageUrl) {
                    elements.push(
                        <img
                            key={index}
                            src={imageUrl}
                            alt={imageBlock.alt || ""}
                            loading="lazy"
                            className="max-w-[300px] w-full rounded-lg my-6 mx-auto"
                            width={imageBlock.asset.metadata?.dimensions?.width}
                            height={
                                imageBlock.asset.metadata?.dimensions?.height
                            }
                        />
                    );
                }
            }
            return;
        }

        // Handle text blocks
        if (block._type === "block") {
            const textBlock = block as SanityBlock;

            // Skip empty blocks (blocks with only empty text)
            const hasContent = textBlock.children?.some(
                (child) => child.text && child.text.trim() !== ""
            );
            if (!hasContent) {
                // If it's a list item, flush the list
                if (textBlock.listItem) {
                    flushList();
                }
                return;
            }

            const textContent = renderTextWithMarks(
                textBlock.children,
                textBlock.markDefs
            );

            // If no content after filtering, skip
            if (!textContent) return;

            // Handle lists
            if (textBlock.listItem) {
                if (currentListType !== textBlock.listItem) {
                    flushList();
                    currentListType = textBlock.listItem;
                }
                listItems.push(
                    <li key={`list-item-${index}`} className="mb-1">
                        {textContent}
                    </li>
                );
                return;
            }

            // Flush any pending list before rendering other block types
            flushList();

            // Handle different block styles
            switch (textBlock.style) {
                case "h1":
                    elements.push(
                        <h1
                            key={index}
                            className="text-4xl font-bold mb-4 mt-8"
                        >
                            {textContent}
                        </h1>
                    );
                    break;
                case "h2":
                    elements.push(
                        <h2
                            key={index}
                            className="text-3xl font-bold mb-3 mt-8"
                        >
                            {textContent}
                        </h2>
                    );
                    break;
                case "h3":
                    elements.push(
                        <h3
                            key={index}
                            className="text-2xl font-semibold mb-2 mt-6"
                        >
                            {textContent}
                        </h3>
                    );
                    break;
                case "h4":
                    elements.push(
                        <h4
                            key={index}
                            className="text-xl font-semibold mb-2 mt-4"
                        >
                            {textContent}
                        </h4>
                    );
                    break;
                case "blockquote":
                    elements.push(
                        <blockquote
                            key={index}
                            className="border-l-4 border-primary pl-4 italic my-4"
                        >
                            {textContent}
                        </blockquote>
                    );
                    break;
                case "normal":
                default:
                    elements.push(
                        <p
                            key={index}
                            className="text-base leading-relaxed mb-4"
                        >
                            {textContent}
                        </p>
                    );
                    break;
            }
        }
    });

    // Flush any remaining list items
    flushList();

    return <div className={`space-y-2 ${className}`}>{elements}</div>;
};
