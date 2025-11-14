export default {
  name: 'gallery',
  title: 'Gallery',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Gallery Title',
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
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
            },
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Important for accessibility and SEO',
            },
          ],
          preview: {
            select: {
              media: 'image',
              caption: 'caption',
            },
            prepare({ caption }: any) {
              return {
                title: caption || 'Untitled image',
              };
            },
          },
        },
      ],
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Events', value: 'events' },
          { title: 'Community', value: 'community' },
          { title: 'Activities', value: 'activities' },
          { title: 'Volunteers', value: 'volunteers' },
          { title: 'Facilities', value: 'facilities' },
          { title: 'Other', value: 'other' },
        ],
      },
    },
    {
      name: 'featured',
      title: 'Featured Gallery',
      type: 'boolean',
      default: false,
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'images.0.image',
      categories: 'categories',
    },
    prepare({ title, categories }: any) {
      return {
        title: title || 'Unnamed',
        subtitle: categories && categories.length > 0 ? categories.join(', ') : 'No categories',
      };
    },
  },
};

