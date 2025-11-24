import type { ReactNode } from "react";
import type {
    SanityPortableTextBlock,
    SanityBlock,
    SanityImageBlock,
} from "@/lib/sanity.types";
import { getImageUrlFromString } from "@/lib/sanityImage";
import { Timeline } from "@/components/Timeline";

interface PortableTextProps {
    blocks: SanityPortableTextBlock[];
    className?: string;
}

interface TimelineItem {
    year: string;
    title?: string;
    description: string;
}

// Helper function to extract plain text from block children
const extractTextFromBlock = (children?: SanityBlock["children"]): string => {
    if (!children) return "";
    return children
        .map((child) => child.text || "")
        .join("")
        .trim();
};

// Helper function to filter timeline tags from children
const filterTimelineTags = (
    children: SanityBlock["children"],
    timelineStartIndex: number,
    timelineEndIndex: number
): SanityBlock["children"] => {
    if (!children) return children;

    let currentPos = 0;
    const filtered: SanityBlock["children"] = [];

    for (const child of children) {
        const childText = child.text || "";
        const childStart = currentPos;
        const childEnd = currentPos + childText.length;

        // Check if this child contains timeline tags
        if (childEnd <= timelineStartIndex) {
            // Child is completely before timeline, keep it
            filtered.push(child);
        } else if (childStart >= timelineEndIndex) {
            // Child is completely after timeline, keep it
            filtered.push(child);
        } else if (
            childStart < timelineStartIndex &&
            childEnd > timelineEndIndex
        ) {
            // Child spans across timeline tags - split it
            const beforeText = childText.substring(
                0,
                timelineStartIndex - childStart
            );
            const afterText = childText.substring(
                timelineEndIndex - childStart
            );

            if (beforeText) {
                filtered.push({ ...child, text: beforeText });
            }
            if (afterText) {
                filtered.push({ ...child, text: afterText });
            }
        } else if (
            childStart < timelineStartIndex &&
            childEnd > timelineStartIndex
        ) {
            // Child ends in timeline start - keep only before part
            const beforeText = childText.substring(
                0,
                timelineStartIndex - childStart
            );
            if (beforeText) {
                filtered.push({ ...child, text: beforeText });
            }
        } else if (
            childStart < timelineEndIndex &&
            childEnd > timelineEndIndex
        ) {
            // Child starts in timeline end - keep only after part
            const afterText = childText.substring(
                timelineEndIndex - childStart
            );
            if (afterText) {
                filtered.push({ ...child, text: afterText });
            }
        }
        // If child is completely within timeline tags, skip it

        currentPos = childEnd;
    }

    return filtered;
};

// Helper function to parse timeline content
const parseTimelineContent = (text: string): TimelineItem[] => {
    // Extract content between <timeline> and </timeline> tags
    const timelineMatch = text.match(/<timeline>([\s\S]*?)<\/timeline>/i);
    if (!timelineMatch) return [];

    const timelineContent = timelineMatch[1].trim();
    if (!timelineContent) return [];

    const items: TimelineItem[] = [];
    const lines = timelineContent.split("\n");

    let currentItem: Partial<TimelineItem> | null = null;
    let descriptionLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
        const trimmedLine = lines[i].trim();

        // Check if this line starts a new timeline entry (YEAR: Title format)
        const yearTitleMatch = trimmedLine.match(
            /^(\d{4}(?:\s*\([^)]+\))?):\s*(.+)$/
        );
        if (yearTitleMatch) {
            // Save previous item if exists
            if (currentItem && currentItem.year) {
                items.push({
                    year: currentItem.year,
                    title: currentItem.title,
                    description: descriptionLines.join(" ").trim(),
                });
            }

            // Start new item
            currentItem = {
                year: yearTitleMatch[1].trim(),
                title: yearTitleMatch[2].trim(),
            };
            descriptionLines = [];
        } else if (currentItem && trimmedLine) {
            // This is a description line for the current item
            descriptionLines.push(trimmedLine);
        } else if (!trimmedLine && currentItem && descriptionLines.length > 0) {
            // Empty line after description - continue collecting (might be multi-paragraph)
            // Don't reset, just continue
        }
    }

    // Don't forget the last item
    if (currentItem && currentItem.year) {
        items.push({
            year: currentItem.year,
            title: currentItem.title,
            description: descriptionLines.join(" ").trim(),
        });
    }

    return items;
};

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

    // Track timeline state - collect text across blocks
    let timelineText = "";
    let insideTimeline = false;
    let timelineStartIndex = -1;

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

    const processTimeline = () => {
        if (timelineText) {
            const timelineItems = parseTimelineContent(timelineText);
            if (timelineItems.length > 0) {
                flushList();
                elements.push(
                    <Timeline
                        key={`timeline-${timelineStartIndex}`}
                        items={timelineItems}
                    />
                );
            }
            timelineText = "";
            insideTimeline = false;
            timelineStartIndex = -1;
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

            // Extract plain text for timeline detection
            const plainText = extractTextFromBlock(textBlock.children);

            // Track if we need to filter timeline tags from children
            let filteredChildren = textBlock.children;
            let hasTimelineInBlock = false;

            // Check if timeline starts in this block
            if (plainText.includes("<timeline>")) {
                insideTimeline = true;
                timelineStartIndex =
                    timelineStartIndex === -1 ? index : timelineStartIndex;
                const startIndex = plainText.indexOf("<timeline>");

                // Check if timeline also ends in this block
                if (plainText.includes("</timeline>")) {
                    const endIndex = plainText.indexOf("</timeline>");
                    // Extract content between tags
                    timelineText = plainText.substring(
                        startIndex,
                        endIndex + 11
                    ); // 11 = length of "</timeline>"
                    processTimeline();

                    // Filter timeline tags from children before rendering
                    hasTimelineInBlock = true;
                    filteredChildren = filterTimelineTags(
                        textBlock.children,
                        startIndex,
                        endIndex + 11
                    );

                    // Continue processing remaining text after </timeline> if any
                    const remainingText = plainText
                        .substring(endIndex + 11)
                        .trim();
                    if (
                        !remainingText &&
                        (!filteredChildren || filteredChildren.length === 0)
                    ) {
                        return; // Skip this block if no remaining content
                    }
                    // Process remaining text as normal content below
                } else {
                    // Timeline starts but doesn't end in this block
                    timelineText = plainText.substring(startIndex);

                    // Filter timeline start tag from children
                    hasTimelineInBlock = true;
                    filteredChildren = filterTimelineTags(
                        textBlock.children,
                        startIndex,
                        plainText.length
                    );

                    if (!filteredChildren || filteredChildren.length === 0) {
                        return; // Skip normal rendering, wait for closing tag
                    }
                    // Process remaining text before timeline as normal content below
                }
            } else if (insideTimeline) {
                // We're inside a timeline, check if it ends in this block
                if (plainText.includes("</timeline>")) {
                    const endIndex = plainText.indexOf("</timeline>");
                    timelineText +=
                        "\n" + plainText.substring(0, endIndex + 11);
                    processTimeline();

                    // Filter timeline end tag from children before rendering
                    hasTimelineInBlock = true;
                    filteredChildren = filterTimelineTags(
                        textBlock.children,
                        0,
                        endIndex + 11
                    );

                    // Continue processing remaining text after </timeline> if any
                    const remainingText = plainText
                        .substring(endIndex + 11)
                        .trim();
                    if (
                        !remainingText &&
                        (!filteredChildren || filteredChildren.length === 0)
                    ) {
                        return; // Skip this block if no remaining content
                    }
                    // Process remaining text as normal content below
                } else {
                    // Still collecting timeline content
                    timelineText += "\n" + plainText;
                    return; // Skip normal rendering
                }
            }

            // Skip empty blocks (blocks with only empty text)
            const hasContent = filteredChildren?.some(
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
                filteredChildren,
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

    // Process any remaining timeline content
    if (insideTimeline) {
        processTimeline();
    }

    return <div className={`space-y-2 ${className}`}>{elements}</div>;
};
