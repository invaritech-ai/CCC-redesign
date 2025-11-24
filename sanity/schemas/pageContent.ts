export default {
    name: "pageContent",
    title: "Page Content",
    type: "document",
    fields: [
        {
            name: "pageSlug",
            title: "Page Slug",
            type: "string",
            description:
                "Unique identifier for the page (e.g., 'community', 'about')",
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "heading",
            title: "Page Heading",
            type: "string",
            description: "Main heading for the page (becomes h1)",
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "subheading",
            title: "Page Subheading",
            type: "string",
            description: "Subheading displayed below the main heading",
        },
        {
            name: "content",
            title: "Page Content",
            type: "array",
            of: [
                {
                    type: "block",
                },
                {
                    type: "image",
                    options: { hotspot: true },
                },
            ],
            description: "Main content for the page using WYSIWYG editor",
        },
        {
            name: "badgeText",
            title: "Badge Text",
            type: "string",
            description:
                "Optional badge text displayed in the hero section (e.g., 'Section 88 Charity')",
        },
        {
            name: "heroImage",
            title: "Hero Image",
            type: "image",
            options: {
                hotspot: true,
            },
            description:
                "Optional hero image. If left empty, the default green background will be shown.",
        },
        {
            name: "bottomImages",
            title: "Bottom Images",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        {
                            name: "image",
                            title: "Image",
                            type: "image",
                            options: {
                                hotspot: true,
                            },
                            validation: (Rule: any) => Rule.required(),
                        },
                        {
                            name: "alt",
                            title: "Alt Text",
                            type: "string",
                            description: "Important for accessibility and SEO",
                        },
                    ],
                    preview: {
                        select: {
                            media: "image",
                            alt: "alt",
                        },
                        prepare({ alt }: any) {
                            return {
                                title: alt || "Image without alt text",
                                media: "image",
                            };
                        },
                    },
                },
            ],
            description:
                "Optional list of images to display at the bottom of the page. Select images from your Sanity asset library.",
        },
    ],
    preview: {
        select: {
            pageSlug: "pageSlug",
            heading: "heading",
        },
        prepare({ pageSlug, heading }: any) {
            return {
                title: heading || "Untitled",
                subtitle: `Page: ${pageSlug || "No slug"}`,
            };
        },
    },
};
