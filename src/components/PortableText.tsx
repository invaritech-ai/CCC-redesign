import type { ReactNode } from "react";
import type {
    SanityPortableTextBlock,
    SanityBlock,
    SanityImageBlock,
} from "@/lib/sanity.types";
import { getImageUrlFromString } from "@/lib/sanityImage";
import { Timeline } from "@/components/Timeline";
import { Grid } from "@/components/Grid";
import { InfoCards } from "@/components/InfoCards";
import type { InfoCardItem } from "@/components/InfoCard";

interface PortableTextProps {
    blocks: SanityPortableTextBlock[];
    className?: string;
}

interface TimelineItem {
    year: string;
    title?: string;
    description: string;
}

interface GridItem {
    icon: string;
    title: string;
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

// Helper function to filter grid tags from children (similar to filterTimelineTags)
const filterGridTags = (
    children: SanityBlock["children"],
    gridStartIndex: number,
    gridEndIndex: number
): SanityBlock["children"] => {
    if (!children) return children;

    let currentPos = 0;
    const filtered: SanityBlock["children"] = [];

    for (const child of children) {
        const childText = child.text || "";
        const childStart = currentPos;
        const childEnd = currentPos + childText.length;

        // Check if this child contains grid tags
        if (childEnd <= gridStartIndex) {
            // Child is completely before grid, keep it
            filtered.push(child);
        } else if (childStart >= gridEndIndex) {
            // Child is completely after grid, keep it
            filtered.push(child);
        } else if (childStart < gridStartIndex && childEnd > gridEndIndex) {
            // Child spans across grid tags - split it
            const beforeText = childText.substring(
                0,
                gridStartIndex - childStart
            );
            const afterText = childText.substring(gridEndIndex - childStart);

            if (beforeText) {
                filtered.push({ ...child, text: beforeText });
            }
            if (afterText) {
                filtered.push({ ...child, text: afterText });
            }
        } else if (childStart < gridStartIndex && childEnd > gridStartIndex) {
            // Child ends in grid start - keep only before part
            const beforeText = childText.substring(
                0,
                gridStartIndex - childStart
            );
            if (beforeText) {
                filtered.push({ ...child, text: beforeText });
            }
        } else if (childStart < gridEndIndex && childEnd > gridEndIndex) {
            // Child starts in grid end - keep only after part
            const afterText = childText.substring(gridEndIndex - childStart);
            if (afterText) {
                filtered.push({ ...child, text: afterText });
            }
        }
        // If child is completely within grid tags, skip it

        currentPos = childEnd;
    }

    return filtered;
};

// Helper function to filter card tags from children (similar to filterTimelineTags/filterGridTags)
const filterCardTags = (
    children: SanityBlock["children"],
    cardStartIndex: number,
    cardEndIndex: number
): SanityBlock["children"] => {
    if (!children) return children;

    let currentPos = 0;
    const filtered: SanityBlock["children"] = [];

    for (const child of children) {
        const childText = child.text || "";
        const childStart = currentPos;
        const childEnd = currentPos + childText.length;

        // Check if this child contains card tags
        if (childEnd <= cardStartIndex) {
            // Child is completely before card, keep it
            filtered.push(child);
        } else if (childStart >= cardEndIndex) {
            // Child is completely after card, keep it
            filtered.push(child);
        } else if (childStart < cardStartIndex && childEnd > cardEndIndex) {
            // Child spans across card tags - split it
            const beforeText = childText.substring(
                0,
                cardStartIndex - childStart
            );
            const afterText = childText.substring(cardEndIndex - childStart);

            if (beforeText) {
                filtered.push({ ...child, text: beforeText });
            }
            if (afterText) {
                filtered.push({ ...child, text: afterText });
            }
        } else if (childStart < cardStartIndex && childEnd > cardStartIndex) {
            // Child ends in card start - keep only before part
            const beforeText = childText.substring(
                0,
                cardStartIndex - childStart
            );
            if (beforeText) {
                filtered.push({ ...child, text: beforeText });
            }
        } else if (childStart < cardEndIndex && childEnd > cardEndIndex) {
            // Child starts in card end - keep only after part
            const afterText = childText.substring(cardEndIndex - childStart);
            if (afterText) {
                filtered.push({ ...child, text: afterText });
            }
        }
        // If child is completely within card tags, skip it

        currentPos = childEnd;
    }

    return filtered;
};

// Helper function to parse card content
const parseCardContent = (text: string): InfoCardItem | null => {
    // Extract content between <card> and </card> tags
    const cardMatch = text.match(/<card>([\s\S]*?)<\/card>/i);
    if (!cardMatch) return null;

    const cardContent = cardMatch[1].trim();
    if (!cardContent) return null;

    const lines = cardContent.split("\n");
    const processedLines: { line: string; trimmed: string; isIndented: boolean; originalIndex: number }[] = [];

    // Process all lines and identify structure
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        if (trimmed) {
            // Check if line starts with spaces or tabs (indented)
            const isIndented = /^[\s\t]+/.test(line);
            processedLines.push({
                line: line,
                trimmed: trimmed,
                isIndented: isIndented,
                originalIndex: i
            });
        }
    }

    if (processedLines.length === 0) return null;

    // Check if any line is indented
    const hasIndentation = processedLines.some(item => item.isIndented);

    // First non-empty line is always the title
    const title = processedLines[0].trimmed;
    let subtitle: string | undefined;
    let closingStatement: string | undefined;
    const bulletPoints: string[] = [];

    if (hasIndentation) {
        // EXISTING LOGIC: Rely on indentation
        
        // Find subtitle: first non-indented line after title
        let subtitleIndex = -1;
        for (let i = 1; i < processedLines.length; i++) {
            if (!processedLines[i].isIndented) {
                subtitle = processedLines[i].trimmed;
                subtitleIndex = i;
                break;
            }
        }

        // Collect all indented lines as bullet points (skip title and subtitle)
        const startIndex = subtitleIndex >= 0 ? subtitleIndex + 1 : 1;
        
        for (let i = startIndex; i < processedLines.length; i++) {
            const item = processedLines[i];
            // Only collect indented lines (these are bullet points)
            if (item.isIndented) {
                bulletPoints.push(item.trimmed);
            }
        }

        // Find closing statement: last non-indented line that comes after bullets
        if (processedLines.length > 1) {
            // Find the index of the last bullet point
            let lastBulletIndex = -1;
            for (let i = processedLines.length - 1; i >= 0; i--) {
                if (processedLines[i].isIndented) {
                    lastBulletIndex = i;
                    break;
                }
            }
            
            // If we have bullets, look for closing statement after the last bullet
            // Otherwise, look for any non-title/subtitle line
            const searchStartIndex = lastBulletIndex >= 0 ? lastBulletIndex + 1 : (subtitleIndex >= 0 ? subtitleIndex + 1 : 1);
            
            for (let i = processedLines.length - 1; i >= searchStartIndex; i--) {
                const item = processedLines[i];
                if (!item.isIndented) {
                    closingStatement = item.trimmed;
                    break;
                }
            }
        }
    } else {
        // FALLBACK LOGIC: No indentation found, use position
        // Structure: Title -> [Subtitle] -> [Bullets] -> [Closing]
        
        const remainingLines = processedLines.slice(1); // Skip title
        
        if (remainingLines.length > 0) {
            // Check for subtitle (Line 1)
            // Heuristic: If it's the only line, it's a subtitle (or bullet? let's say subtitle)
            // If there are multiple lines, Line 1 is subtitle
            subtitle = remainingLines[0].trimmed;
            
            // If there are more lines, check for closing statement
            if (remainingLines.length > 1) {
                // Heuristic: Last line is closing statement if we have at least 3 lines total (Title + Subtitle + Closing)
                // If we have Title + Subtitle + 1 Bullet, is the bullet a closing statement?
                // Let's assume if > 2 remaining lines (Subtitle + 1 Bullet + Closing), last is closing
                // If 2 remaining lines (Subtitle + 1 Line), treat 1 Line as bullet? Or closing?
                // Based on examples: "Our goal is simple..." (Closing) vs "English-speaking..." (Bullet)
                // Closings are usually sentences. Bullets are phrases.
                // But hard to detect.
                // Let's stick to the pattern: Title -> Subtitle -> Bullets -> Closing
                
                // If we have at least 2 lines in between Subtitle and End, take the last as closing
                // If we only have 1 line after Subtitle, treat it as a bullet (safe bet)
                
                if (remainingLines.length >= 3) {
                    closingStatement = remainingLines[remainingLines.length - 1].trimmed;
                    // Bullets are everything in between
                    for (let i = 1; i < remainingLines.length - 1; i++) {
                        bulletPoints.push(remainingLines[i].trimmed);
                    }
                } else {
                    // Only 1 or 2 lines after title.
                    // Case: Title, Subtitle, Bullet 1. (Length 2) -> Subtitle, Bullet 1
                    // Case: Title, Subtitle, Closing. (Length 2) -> Subtitle, Closing?
                    // Let's treat as bullets if they are in the middle.
                    
                    // Actually, if we have Title, Line 1, Line 2.
                    // Line 1 = Subtitle.
                    // Line 2 = Bullet?
                    // If we assume the user ALWAYS provides a subtitle if they provide bullets...
                    
                    for (let i = 1; i < remainingLines.length; i++) {
                        bulletPoints.push(remainingLines[i].trimmed);
                    }
                }
            }
        }
    }

    return {
        title,
        subtitle,
        bulletPoints,
        closingStatement,
    };
};

// Helper function to parse grid content
const parseGridContent = (text: string): GridItem[] => {
    // Extract content between <grid> and </grid> tags
    const gridMatch = text.match(/<grid>([\s\S]*?)<\/grid>/i);
    if (!gridMatch) return [];

    const gridContent = gridMatch[1].trim();
    if (!gridContent) return [];

    const items: GridItem[] = [];
    const lines = gridContent.split("\n");

    let currentItem: Partial<GridItem> | null = null;
    let descriptionLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
        const trimmedLine = lines[i].trim();

        // Check if this line starts a new grid entry (IconName: Title format)
        // Pattern: IconName: Title (e.g., "FaHeart: Compassion" or "HeartIcon: Compassion")
        // Supports any icon name format from react-icons (Fa*, Hi*, Md*, etc.) or custom names
        // Icon name must start with uppercase letter (typical for component names)
        const iconTitleMatch = trimmedLine.match(
            /^([A-Z][A-Za-z0-9]*):\s*(.+)$/
        );
        if (iconTitleMatch) {
            // Save previous item if exists
            if (currentItem && currentItem.icon) {
                items.push({
                    icon: currentItem.icon,
                    title: currentItem.title || "",
                    description: descriptionLines.join(" ").trim(),
                });
            }

            // Start new item
            currentItem = {
                icon: iconTitleMatch[1].trim(),
                title: iconTitleMatch[2].trim(),
            };
            descriptionLines = [];
        } else if (currentItem && trimmedLine) {
            // This is a description line for the current item
            // Remove surrounding quotes if present
            const cleanLine = trimmedLine.replace(/^["']|["']$/g, "");
            descriptionLines.push(cleanLine);
        } else if (!trimmedLine && currentItem && descriptionLines.length > 0) {
            // Empty line after description - continue collecting (might be multi-paragraph)
            // Don't reset, just continue
        }
    }

    // Don't forget the last item
    if (currentItem && currentItem.icon) {
        items.push({
            icon: currentItem.icon,
            title: currentItem.title || "",
            description: descriptionLines.join(" ").trim(),
        });
    }

    return items;
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

    // Track grid state - collect text across blocks
    let gridText = "";
    let insideGrid = false;
    let gridStartIndex = -1;

    // Track card state - collect cards across blocks
    let cardItems: InfoCardItem[] = [];
    let cardText = "";
    let insideCard = false;
    let cardStartIndex = -1;

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

    const processGrid = () => {
        if (gridText) {
            const gridItems = parseGridContent(gridText);
            if (gridItems.length > 0) {
                flushList();
                elements.push(
                    <Grid key={`grid-${gridStartIndex}`} items={gridItems} />
                );
            }
            gridText = "";
            insideGrid = false;
            gridStartIndex = -1;
        }
    };

    const processCards = () => {
        if (cardItems.length > 0) {
            flushList();
            elements.push(
                <InfoCards key={`cards-${cardStartIndex}`} items={cardItems} />
            );
            cardItems = [];
            cardText = "";
            insideCard = false;
            cardStartIndex = -1;
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

            // Extract plain text for timeline and grid detection
            const plainText = extractTextFromBlock(textBlock.children);

            // Track if we need to filter timeline/grid/card tags from children
            let filteredChildren = textBlock.children;
            let hasTimelineInBlock = false;
            let hasGridInBlock = false;
            let hasCardInBlock = false;

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

            // Check if grid starts in this block
            if (plainText.includes("<grid>")) {
                insideGrid = true;
                gridStartIndex = gridStartIndex === -1 ? index : gridStartIndex;
                const startIndex = plainText.indexOf("<grid>");

                // Check if grid also ends in this block
                if (plainText.includes("</grid>")) {
                    const endIndex = plainText.indexOf("</grid>");
                    // Extract content between tags
                    gridText = plainText.substring(startIndex, endIndex + 7); // 7 = length of "</grid>"
                    processGrid();

                    // Filter grid tags from children before rendering
                    // Use textBlock.children (original) instead of filteredChildren
                    // because indices are calculated from plainText which is based on original
                    // This fixes the bug where grid filtering used filteredChildren (already modified by timeline)
                    // but indices were from plainText (based on original)
                    hasGridInBlock = true;
                    filteredChildren = filterGridTags(
                        textBlock.children,
                        startIndex,
                        endIndex + 7
                    );

                    // Continue processing remaining text after </grid> if any
                    const remainingText = plainText
                        .substring(endIndex + 7)
                        .trim();
                    if (
                        !remainingText &&
                        (!filteredChildren || filteredChildren.length === 0)
                    ) {
                        return; // Skip this block if no remaining content
                    }
                    // Process remaining text as normal content below
                } else {
                    // Grid starts but doesn't end in this block
                    gridText = plainText.substring(startIndex);

                    // Filter grid start tag from children
                    // Use textBlock.children (original) instead of filteredChildren
                    // because indices are calculated from plainText which is based on original
                    // This fixes the bug where grid filtering used filteredChildren (already modified by timeline)
                    // but indices were from plainText (based on original)
                    hasGridInBlock = true;
                    filteredChildren = filterGridTags(
                        textBlock.children,
                        startIndex,
                        plainText.length
                    );

                    if (!filteredChildren || filteredChildren.length === 0) {
                        return; // Skip normal rendering, wait for closing tag
                    }
                    // Process remaining text before grid as normal content below
                }
            } else if (insideGrid) {
                // We're inside a grid, check if it ends in this block
                if (plainText.includes("</grid>")) {
                    const endIndex = plainText.indexOf("</grid>");
                    gridText += "\n" + plainText.substring(0, endIndex + 7);
                    processGrid();

                    // Filter grid end tag from children before rendering
                    // Use textBlock.children (original) instead of filteredChildren
                    // because indices are calculated from plainText which is based on original
                    // This fixes the bug where grid filtering used filteredChildren (already modified by timeline)
                    // but indices were from plainText (based on original)
                    hasGridInBlock = true;
                    filteredChildren = filterGridTags(
                        textBlock.children,
                        0,
                        endIndex + 7
                    );

                    // Continue processing remaining text after </grid> if any
                    const remainingText = plainText
                        .substring(endIndex + 7)
                        .trim();
                    if (
                        !remainingText &&
                        (!filteredChildren || filteredChildren.length === 0)
                    ) {
                        return; // Skip this block if no remaining content
                    }
                    // Process remaining text as normal content below
                } else {
                    // Still collecting grid content
                    gridText += "\n" + plainText;
                    return; // Skip normal rendering
                }
            }

            // Check if card starts in this block
            if (plainText.includes("<card>")) {
                insideCard = true;
                cardStartIndex = cardStartIndex === -1 ? index : cardStartIndex;
                const startIndex = plainText.indexOf("<card>");

                // Check if card also ends in this block
                if (plainText.includes("</card>")) {
                    const endIndex = plainText.indexOf("</card>");
                    // Extract content between tags
                    cardText = plainText.substring(startIndex, endIndex + 7); // 7 = length of "</card>"
                    const cardItem = parseCardContent(cardText);
                    if (cardItem) {
                        cardItems.push(cardItem);
                    }

                    // Filter card tags from children before rendering
                    hasCardInBlock = true;
                    filteredChildren = filterCardTags(
                        textBlock.children,
                        startIndex,
                        endIndex + 7
                    );

                    // Reset card state since this card is complete
                    cardText = "";
                    insideCard = false;

                    // Continue processing remaining text after </card> if any
                    const remainingText = plainText
                        .substring(endIndex + 7)
                        .trim();
                    if (
                        !remainingText &&
                        (!filteredChildren || filteredChildren.length === 0)
                    ) {
                        return; // Skip this block if no remaining content
                    }
                    // Process remaining text as normal content below
                } else {
                    // Card starts but doesn't end in this block
                    cardText = plainText.substring(startIndex);

                    // Filter card start tag from children
                    hasCardInBlock = true;
                    filteredChildren = filterCardTags(
                        textBlock.children,
                        startIndex,
                        plainText.length
                    );

                    if (!filteredChildren || filteredChildren.length === 0) {
                        return; // Skip normal rendering, wait for closing tag
                    }
                    // Process remaining text before card as normal content below
                }
            } else if (insideCard) {
                // We're inside a card, check if it ends in this block
                if (plainText.includes("</card>")) {
                    const endIndex = plainText.indexOf("</card>");
                    cardText += "\n" + plainText.substring(0, endIndex + 7);
                    const cardItem = parseCardContent(cardText);
                    if (cardItem) {
                        cardItems.push(cardItem);
                    }

                    // Filter card end tag from children before rendering
                    hasCardInBlock = true;
                    filteredChildren = filterCardTags(
                        textBlock.children,
                        0,
                        endIndex + 7
                    );

                    // Reset card state since this card is complete
                    cardText = "";
                    insideCard = false;

                    // Continue processing remaining text after </card> if any
                    const remainingText = plainText
                        .substring(endIndex + 7)
                        .trim();
                    if (
                        !remainingText &&
                        (!filteredChildren || filteredChildren.length === 0)
                    ) {
                        return; // Skip this block if no remaining content
                    }
                    // Process remaining text as normal content below
                } else {
                    // Still collecting card content
                    cardText += "\n" + plainText;
                    return; // Skip normal rendering
                }
            } else if (cardItems.length > 0) {
                // We have collected cards but encountered non-card content
                // Process the cards before continuing with normal content
                processCards();
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

    // Process any remaining grid content
    if (insideGrid) {
        processGrid();
    }

    // Process any remaining card content
    if (insideCard) {
        const cardItem = parseCardContent(cardText);
        if (cardItem) {
            cardItems.push(cardItem);
        }
    }

    // Process any collected cards
    if (cardItems.length > 0) {
        processCards();
    }

    return <div className={`space-y-2 ${className}`}>{elements}</div>;
};
