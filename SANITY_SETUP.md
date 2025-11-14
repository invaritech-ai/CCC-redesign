# Sanity CMS Setup Instructions

This guide will walk you through setting up Sanity CMS for the China Coast Community website.

## Step 1: Install Sanity CLI and Dependencies

```bash
# Install Sanity CLI globally
npm install -g @sanity/cli

# Install Sanity client libraries
npm install @sanity/client @sanity/image-url
```

## Step 2: Initialize Sanity Project

```bash
# Initialize a new Sanity project
sanity init --project-name "ccc-redesign" --dataset production

# Follow the prompts:
# - Choose "Create new project"
# - Select a project template (choose "Blog (schema)" or "Clean project with no predefined schemas")
# - Choose dataset: "production"
# - Project output path: "./sanity" (or your preferred location)
```

## Step 3: Create Schema Files

Create the following schema files in your Sanity project's `schemas` directory (typically `sanity/schemas/`):

### event.ts (Enhanced)

```typescript
export default {
    name: "event",
    title: "Event",
    type: "document",
    fields: [
        {
            name: "title",
            title: "Title",
            type: "string",
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: "title",
                maxLength: 96,
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "date",
            title: "Event Date & Time",
            type: "datetime",
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "time",
            title: "Display Time",
            type: "string",
            description:
                'Optional: Custom time display format (e.g., "2:00 PM - 4:00 PM")',
        },
        {
            name: "description",
            title: "Description",
            type: "text",
        },
        {
            name: "image",
            title: "Image",
            type: "image",
            options: {
                hotspot: true,
            },
        },
        {
            name: "location",
            title: "Location",
            type: "string",
        },
        {
            name: "registrationLink",
            title: "Registration Link",
            type: "url",
            description: "External URL for event registration",
        },
        {
            name: "category",
            title: "Category",
            type: "string",
            options: {
                list: [
                    { title: "Social", value: "social" },
                    { title: "Educational", value: "educational" },
                    { title: "Health & Wellness", value: "health-wellness" },
                    { title: "Cultural", value: "cultural" },
                    { title: "Volunteer", value: "volunteer" },
                    { title: "Fundraising", value: "fundraising" },
                    { title: "Other", value: "other" },
                ],
            },
        },
        {
            name: "organizer",
            title: "Organizer Information",
            type: "object",
            fields: [
                {
                    name: "name",
                    title: "Organizer Name",
                    type: "string",
                },
                {
                    name: "email",
                    title: "Email",
                    type: "string",
                },
                {
                    name: "phone",
                    title: "Phone",
                    type: "string",
                },
            ],
        },
        {
            name: "featured",
            title: "Featured Event",
            type: "boolean",
            default: false,
        },
    ],
    preview: {
        select: {
            title: "title",
            date: "date",
        },
        prepare({ title, date, category }: any) {
            return {
                title,
                subtitle: `${
                    date ? new Date(date).toLocaleDateString() : "No date"
                }${category ? ` • ${category}` : ""}`,
            };
        },
    },
};
```

### update.ts (Enhanced - Merged with Stories)

```typescript
export default {
    name: "update",
    title: "Update / Story",
    type: "document",
    fields: [
        {
            name: "title",
            title: "Title",
            type: "string",
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: "title",
                maxLength: 96,
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "type",
            title: "Content Type",
            type: "string",
            options: {
                list: [
                    { title: "News", value: "news" },
                    { title: "Announcement", value: "announcement" },
                    { title: "Story", value: "story" },
                    { title: "Article", value: "article" },
                ],
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "publishedAt",
            title: "Published At",
            type: "datetime",
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "author",
            title: "Author",
            type: "string",
        },
        {
            name: "excerpt",
            title: "Excerpt",
            type: "text",
        },
        {
            name: "body",
            title: "Body",
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
        },
        {
            name: "image",
            title: "Featured Image",
            type: "image",
            options: {
                hotspot: true,
            },
        },
        {
            name: "tags",
            title: "Tags",
            type: "array",
            of: [{ type: "string" }],
            options: {
                layout: "tags",
            },
        },
        {
            name: "categories",
            title: "Categories",
            type: "array",
            of: [{ type: "string" }],
            options: {
                list: [
                    { title: "Community", value: "community" },
                    { title: "Events", value: "events" },
                    { title: "Services", value: "services" },
                    { title: "Impact", value: "impact" },
                    { title: "Volunteers", value: "volunteers" },
                    { title: "Stories", value: "stories" },
                ],
            },
        },
        {
            name: "relatedEvent",
            title: "Related Event",
            type: "reference",
            to: [{ type: "event" }],
        },
        {
            name: "relatedLinks",
            title: "Related Links",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        {
                            name: "title",
                            title: "Link Title",
                            type: "string",
                        },
                        {
                            name: "url",
                            title: "URL",
                            type: "url",
                        },
                    ],
                },
            ],
        },
        {
            name: "featured",
            title: "Featured Update",
            type: "boolean",
            default: false,
        },
    ],
    preview: {
        select: {
            title: "title",
            publishedAt: "publishedAt",
            type: "type",
        },
        prepare({ title, publishedAt, type }: any) {
            return {
                title,
                subtitle: `${type || "update"} • ${
                    publishedAt
                        ? new Date(publishedAt).toLocaleDateString()
                        : "No date"
                }`,
            };
        },
    },
};
```

### report.ts (Enhanced)

```typescript
export default {
    name: "report",
    title: "Report",
    type: "document",
    fields: [
        {
            name: "title",
            title: "Title",
            type: "string",
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: "title",
                maxLength: 96,
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "year",
            title: "Year",
            type: "number",
            validation: (Rule: any) =>
                Rule.required().min(1978).max(new Date().getFullYear()),
        },
        {
            name: "summary",
            title: "Summary",
            type: "text",
            description: "Brief summary of the report",
        },
        {
            name: "description",
            title: "Description",
            type: "text",
        },
        {
            name: "author",
            title: "Author / Organization",
            type: "string",
        },
        {
            name: "relatedTopics",
            title: "Related Topics",
            type: "array",
            of: [{ type: "string" }],
            options: {
                layout: "tags",
            },
        },
        {
            name: "pdf",
            title: "PDF File",
            type: "file",
            options: {
                accept: ".pdf",
            },
        },
        {
            name: "image",
            title: "Cover Image",
            type: "image",
            options: {
                hotspot: true,
            },
        },
    ],
    preview: {
        select: {
            title: "title",
            year: "year",
            author: "author",
        },
        prepare({ title, year, author }: any) {
            return {
                title,
                subtitle: `${year ? `Year: ${year}` : "No year"}${
                    author ? ` • ${author}` : ""
                }`,
            };
        },
    },
};
```

### partner.ts (Enhanced)

```typescript
export default {
    name: "partner",
    title: "Partner",
    type: "document",
    fields: [
        {
            name: "name",
            title: "Partner Name",
            type: "string",
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "logo",
            title: "Logo",
            type: "image",
            options: {
                hotspot: true,
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "description",
            title: "Description",
            type: "text",
            description: "Brief description of the partner and partnership",
        },
        {
            name: "website",
            title: "Website URL",
            type: "url",
        },
        {
            name: "partnershipType",
            title: "Partnership Type",
            type: "string",
            options: {
                list: [
                    { title: "Corporate Sponsor", value: "corporate-sponsor" },
                    { title: "Community Partner", value: "community-partner" },
                    { title: "Service Provider", value: "service-provider" },
                    {
                        title: "Volunteer Organization",
                        value: "volunteer-organization",
                    },
                    { title: "Government", value: "government" },
                    { title: "Other", value: "other" },
                ],
            },
        },
        {
            name: "contactInfo",
            title: "Contact Information",
            type: "object",
            fields: [
                {
                    name: "email",
                    title: "Email",
                    type: "string",
                },
                {
                    name: "phone",
                    title: "Phone",
                    type: "string",
                },
                {
                    name: "address",
                    title: "Address",
                    type: "text",
                },
            ],
        },
        {
            name: "order",
            title: "Display Order",
            type: "number",
            description: "Lower numbers appear first",
        },
    ],
    preview: {
        select: {
            title: "name",
            media: "logo",
            partnershipType: "partnershipType",
        },
        prepare({ title, partnershipType }: any) {
            return {
                title,
                subtitle: partnershipType || "No type",
            };
        },
    },
};
```

### testimonial.ts (Enhanced)

```typescript
export default {
    name: "testimonial",
    title: "Testimonial",
    type: "document",
    fields: [
        {
            name: "quote",
            title: "Quote",
            type: "text",
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "name",
            title: "Name",
            type: "string",
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "role",
            title: "Role / Position",
            type: "string",
            description:
                "e.g., Community Member, Family Member, Volunteer, Board Member",
        },
        {
            name: "company",
            title: "Company / Organization",
            type: "string",
            description: "Company or organization name (if applicable)",
        },
        {
            name: "detail",
            title: "Additional Detail",
            type: "string",
            description: "e.g., Member since 2015, Resident's Daughter",
        },
        {
            name: "date",
            title: "Testimonial Date",
            type: "date",
            description: "Date when the testimonial was given",
        },
        {
            name: "image",
            title: "Photo",
            type: "image",
            options: {
                hotspot: true,
            },
        },
        {
            name: "featured",
            title: "Featured Testimonial",
            type: "boolean",
            default: false,
            description:
                "Featured testimonials appear in the Featured Story section",
        },
    ],
    preview: {
        select: {
            title: "name",
            role: "role",
            company: "company",
            quote: "quote",
            date: "date",
        },
        prepare({ title, role, company, quote, date }: any) {
            const subtitle =
                [role, company].filter(Boolean).join(" • ") || "No role";
            return {
                title: title || "Unnamed",
                subtitle: `${subtitle}${
                    date ? ` • ${new Date(date).toLocaleDateString()}` : ""
                }`,
                description: quote
                    ? quote.substring(0, 50) + "..."
                    : "No quote",
            };
        },
    },
};
```

### teamMember.ts (New)

```typescript
export default {
    name: "teamMember",
    title: "Team Member",
    type: "document",
    fields: [
        {
            name: "name",
            title: "Name",
            type: "string",
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "photo",
            title: "Photo",
            type: "image",
            options: {
                hotspot: true,
            },
        },
        {
            name: "role",
            title: "Role / Position",
            type: "string",
            validation: (Rule: any) => Rule.required(),
            description:
                "e.g., Executive Director, Board Member, Program Coordinator",
        },
        {
            name: "bio",
            title: "Biography",
            type: "array",
            of: [{ type: "block" }],
            description: "Brief biography or description",
        },
        {
            name: "contactInfo",
            title: "Contact Information",
            type: "object",
            fields: [
                {
                    name: "email",
                    title: "Email",
                    type: "string",
                },
                {
                    name: "phone",
                    title: "Phone",
                    type: "string",
                },
            ],
        },
        {
            name: "socialLinks",
            title: "Social Links",
            type: "object",
            fields: [
                {
                    name: "linkedin",
                    title: "LinkedIn",
                    type: "url",
                },
                {
                    name: "twitter",
                    title: "Twitter",
                    type: "url",
                },
                {
                    name: "facebook",
                    title: "Facebook",
                    type: "url",
                },
            ],
        },
        {
            name: "order",
            title: "Display Order",
            type: "number",
            description: "Lower numbers appear first",
        },
    ],
    preview: {
        select: {
            title: "name",
            role: "role",
            media: "photo",
        },
        prepare({ title, role }: any) {
            return {
                title: title || "Unnamed",
                subtitle: role || "No role",
            };
        },
    },
};
```

### faq.ts (New)

```typescript
export default {
    name: "faq",
    title: "FAQ",
    type: "document",
    fields: [
        {
            name: "question",
            title: "Question",
            type: "string",
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "answer",
            title: "Answer",
            type: "array",
            of: [{ type: "block" }],
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "category",
            title: "Category",
            type: "string",
            options: {
                list: [
                    { title: "General", value: "general" },
                    { title: "Services", value: "services" },
                    { title: "Events", value: "events" },
                    { title: "Volunteering", value: "volunteering" },
                    { title: "Donations", value: "donations" },
                    { title: "Membership", value: "membership" },
                    { title: "Other", value: "other" },
                ],
            },
        },
        {
            name: "order",
            title: "Display Order",
            type: "number",
            description: "Lower numbers appear first",
        },
    ],
    preview: {
        select: {
            title: "question",
            category: "category",
        },
        prepare({ title, category }: any) {
            return {
                title: title || "Unnamed",
                subtitle: category || "No category",
            };
        },
    },
};
```

### resource.ts (New)

```typescript
export default {
    name: "resource",
    title: "Resource",
    type: "document",
    fields: [
        {
            name: "title",
            title: "Title",
            type: "string",
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: "title",
                maxLength: 96,
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "description",
            title: "Description",
            type: "text",
        },
        {
            name: "file",
            title: "File Upload",
            type: "file",
            description: "Upload PDF, DOC, or other document files",
        },
        {
            name: "category",
            title: "Category",
            type: "string",
            options: {
                list: [
                    { title: "Forms", value: "forms" },
                    { title: "Guides", value: "guides" },
                    { title: "Reports", value: "reports" },
                    { title: "Policies", value: "policies" },
                    { title: "Brochures", value: "brochures" },
                    { title: "Other", value: "other" },
                ],
            },
        },
        {
            name: "featured",
            title: "Featured Resource",
            type: "boolean",
            default: false,
        },
    ],
    preview: {
        select: {
            title: "title",
            category: "category",
            media: "file",
        },
        prepare({ title, category }: any) {
            return {
                title: title || "Unnamed",
                subtitle: category || "No category",
            };
        },
    },
};
```

### gallery.ts (New)

```typescript
export default {
    name: "gallery",
    title: "Gallery",
    type: "document",
    fields: [
        {
            name: "title",
            title: "Gallery Title",
            type: "string",
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: "title",
                maxLength: 96,
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "description",
            title: "Description",
            type: "text",
        },
        {
            name: "images",
            title: "Images",
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
                            name: "caption",
                            title: "Caption",
                            type: "string",
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
                            caption: "caption",
                        },
                        prepare({ caption }: any) {
                            return {
                                title: caption || "Untitled image",
                            };
                        },
                    },
                },
            ],
        },
        {
            name: "categories",
            title: "Categories",
            type: "array",
            of: [{ type: "string" }],
            options: {
                list: [
                    { title: "Events", value: "events" },
                    { title: "Community", value: "community" },
                    { title: "Activities", value: "activities" },
                    { title: "Volunteers", value: "volunteers" },
                    { title: "Facilities", value: "facilities" },
                    { title: "Other", value: "other" },
                ],
            },
        },
        {
            name: "featured",
            title: "Featured Gallery",
            type: "boolean",
            default: false,
        },
    ],
    preview: {
        select: {
            title: "title",
            media: "images.0.image",
            categories: "categories",
        },
        prepare({ title, categories }: any) {
            return {
                title: title || "Unnamed",
                subtitle:
                    categories && categories.length > 0
                        ? categories.join(", ")
                        : "No categories",
            };
        },
    },
};
```

### caseStudy.ts (New)

```typescript
export default {
    name: "caseStudy",
    title: "Case Study",
    type: "document",
    fields: [
        {
            name: "title",
            title: "Title",
            type: "string",
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: "title",
                maxLength: 96,
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "description",
            title: "Description",
            type: "array",
            of: [{ type: "block" }],
        },
        {
            name: "images",
            title: "Images",
            type: "array",
            of: [
                {
                    type: "image",
                    options: {
                        hotspot: true,
                    },
                },
            ],
        },
        {
            name: "outcomes",
            title: "Outcomes",
            type: "array",
            of: [{ type: "block" }],
            description: "Key outcomes or results of this case study",
        },
        {
            name: "client",
            title: "Client / Beneficiary",
            type: "string",
            description:
                "Name of the client, beneficiary, or organization involved",
        },
        {
            name: "date",
            title: "Date",
            type: "date",
            description: "Date when the case study was completed or published",
        },
        {
            name: "featured",
            title: "Featured Case Study",
            type: "boolean",
            default: false,
        },
    ],
    preview: {
        select: {
            title: "title",
            client: "client",
            date: "date",
            media: "images.0",
        },
        prepare({ title, client, date }: any) {
            return {
                title: title || "Unnamed",
                subtitle: `${client || "No client"}${
                    date ? ` • ${new Date(date).toLocaleDateString()}` : ""
                }`,
            };
        },
    },
};
```

### pressRelease.ts (New)

```typescript
export default {
    name: "pressRelease",
    title: "Press Release",
    type: "document",
    fields: [
        {
            name: "title",
            title: "Title",
            type: "string",
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: "title",
                maxLength: 96,
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "date",
            title: "Release Date",
            type: "datetime",
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "content",
            title: "Content",
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
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "mediaLinks",
            title: "Media Links",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        {
                            name: "title",
                            title: "Link Title",
                            type: "string",
                            description: 'e.g., "Read on SCMP", "View PDF"',
                        },
                        {
                            name: "url",
                            title: "URL",
                            type: "url",
                        },
                        {
                            name: "type",
                            title: "Link Type",
                            type: "string",
                            options: {
                                list: [
                                    { title: "News Article", value: "news" },
                                    { title: "PDF Document", value: "pdf" },
                                    { title: "Video", value: "video" },
                                    { title: "Other", value: "other" },
                                ],
                            },
                        },
                    ],
                },
            ],
        },
        {
            name: "featured",
            title: "Featured Press Release",
            type: "boolean",
            default: false,
        },
    ],
    preview: {
        select: {
            title: "title",
            date: "date",
        },
        prepare({ title, date }: any) {
            return {
                title: title || "Unnamed",
                subtitle: date
                    ? new Date(date).toLocaleDateString()
                    : "No date",
            };
        },
    },
};
```

## Step 4: Update schema.js

In your Sanity project's main schema file (typically `sanity/schema.js` or `sanity/schemas/index.js`), import and add all the schemas:

```javascript
import event from "./schemas/event";
import update from "./schemas/update";
import report from "./schemas/report";
import partner from "./schemas/partner";
import testimonial from "./schemas/testimonial";
import teamMember from "./schemas/teamMember";
import faq from "./schemas/faq";
import resource from "./schemas/resource";
import gallery from "./schemas/gallery";
import caseStudy from "./schemas/caseStudy";
import pressRelease from "./schemas/pressRelease";

export const schemaTypes = [
    event,
    update,
    report,
    partner,
    testimonial,
    teamMember,
    faq,
    resource,
    gallery,
    caseStudy,
    pressRelease,
];
```

## Step 5: Configure Environment Variables

Create a `.env.local` file in the root of your project:

```env
VITE_SANITY_PROJECT_ID=your_project_id_here
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-01-01
```

To find your project ID:

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select your project
3. Copy the Project ID from the project settings

## Step 6: Deploy Sanity Studio

```bash
# Navigate to your Sanity project directory
cd sanity

# Deploy the studio
sanity deploy

# Follow the prompts to set up hosting
```

After deployment, you'll get a URL like `https://your-project.sanity.studio` where you can manage your content.

## Step 7: Configure CORS

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select your project
3. Go to Settings → API → CORS origins
4. Add your development and production URLs:
    - `http://localhost:8080` (development)
    - `https://your-production-domain.com` (production)

## Step 8: Test the Connection

The Sanity client utility files (`src/lib/sanity.ts` and `src/lib/sanity.queries.ts`) are already created. Test the connection by:

1. Adding some test content in Sanity Studio
2. Checking the browser console for any connection errors
3. Verifying that data appears on your website

## Next Steps

-   Add content through Sanity Studio
-   Update components to fetch data from Sanity (NoticeboardSection, FeaturedStorySection, TrustSignalsSection)
-   Configure image optimization using `@sanity/image-url`
-   Set up webhooks for content updates (optional)

## Troubleshooting

-   **"Project not found"**: Verify your Project ID in `.env.local`
-   **CORS errors**: Make sure your domain is added to CORS origins in Sanity settings
-   **Schema errors**: Check that all schema files are properly imported in `schema.js`
-   **Missing data**: Verify your dataset name matches in `.env.local` and Sanity Studio
