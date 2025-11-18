export default {
  name: "pageContent",
  title: "Page Content",
  type: "document",
  fields: [
    {
      name: "pageSlug",
      title: "Page Slug",
      type: "string",
      description: "Unique identifier for the page (e.g., 'community', 'about')",
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
      description: "Optional badge text displayed in the hero section (e.g., 'Section 88 Charity')",
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

