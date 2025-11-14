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

### event.ts
```typescript
export default {
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'date',
      title: 'Event Date',
      type: 'datetime',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
    },
    {
      name: 'featured',
      title: 'Featured Event',
      type: 'boolean',
      default: false,
    },
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
    },
    prepare({ title, date }: any) {
      return {
        title,
        subtitle: date ? new Date(date).toLocaleDateString() : 'No date',
      };
    },
  },
};
```

### update.ts
```typescript
export default {
  name: 'update',
  title: 'Update',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
    },
    {
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
          type: 'block',
        },
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
    },
    {
      name: 'image',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'featured',
      title: 'Featured Update',
      type: 'boolean',
      default: false,
    },
  ],
  preview: {
    select: {
      title: 'title',
      publishedAt: 'publishedAt',
    },
    prepare({ title, publishedAt }: any) {
      return {
        title,
        subtitle: publishedAt ? new Date(publishedAt).toLocaleDateString() : 'No date',
      };
    },
  },
};
```

### report.ts
```typescript
export default {
  name: 'report',
  title: 'Annual Report',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(1978).max(new Date().getFullYear()),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'pdf',
      title: 'PDF File',
      type: 'file',
      options: {
        accept: '.pdf',
      },
    },
    {
      name: 'image',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
  ],
  preview: {
    select: {
      title: 'title',
      year: 'year',
    },
    prepare({ title, year }: any) {
      return {
        title,
        subtitle: year ? `Year: ${year}` : 'No year',
      };
    },
  },
};
```

### partner.ts
```typescript
export default {
  name: 'partner',
  title: 'Partner',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Partner Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'website',
      title: 'Website URL',
      type: 'url',
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
    },
  ],
  preview: {
    select: {
      title: 'name',
      media: 'logo',
    },
  },
};
```

### testimonial.ts
```typescript
export default {
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    {
      name: 'quote',
      title: 'Quote',
      type: 'text',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'e.g., Community Member, Family Member, Volunteer',
    },
    {
      name: 'detail',
      title: 'Additional Detail',
      type: 'string',
      description: 'e.g., Member since 2015, Resident\'s Daughter',
    },
    {
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'featured',
      title: 'Featured Testimonial',
      type: 'boolean',
      default: false,
      description: 'Featured testimonials appear in the Featured Story section',
    },
  ],
  preview: {
    select: {
      title: 'name',
      role: 'role',
      quote: 'quote',
    },
    prepare({ title, role, quote }: any) {
      return {
        title: title || 'Unnamed',
        subtitle: role || 'No role',
        description: quote ? quote.substring(0, 50) + '...' : 'No quote',
      };
    },
  },
};
```

## Step 4: Update schema.js

In your Sanity project's main schema file (typically `sanity/schema.js` or `sanity/schemas/index.js`), import and add all the schemas:

```javascript
import event from './schemas/event';
import update from './schemas/update';
import report from './schemas/report';
import partner from './schemas/partner';
import testimonial from './schemas/testimonial';

export const schemaTypes = [
  event,
  update,
  report,
  partner,
  testimonial,
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

- Add content through Sanity Studio
- Update components to fetch data from Sanity (NoticeboardSection, FeaturedStorySection, TrustSignalsSection)
- Configure image optimization using `@sanity/image-url`
- Set up webhooks for content updates (optional)

## Troubleshooting

- **"Project not found"**: Verify your Project ID in `.env.local`
- **CORS errors**: Make sure your domain is added to CORS origins in Sanity settings
- **Schema errors**: Check that all schema files are properly imported in `schema.js`
- **Missing data**: Verify your dataset name matches in `.env.local` and Sanity Studio

