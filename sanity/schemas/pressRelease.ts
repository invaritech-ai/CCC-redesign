export default {
  name: 'pressRelease',
  title: 'Press Release',
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
      title: 'Release Date',
      type: 'datetime',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'content',
      title: 'Content',
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
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'mediaLinks',
      title: 'Media Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Link Title',
              type: 'string',
              description: 'e.g., "Read on SCMP", "View PDF"',
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
            },
            {
              name: 'type',
              title: 'Link Type',
              type: 'string',
              options: {
                list: [
                  { title: 'News Article', value: 'news' },
                  { title: 'PDF Document', value: 'pdf' },
                  { title: 'Video', value: 'video' },
                  { title: 'Other', value: 'other' },
                ],
              },
            },
          ],
        },
      ],
    },
    {
      name: 'featured',
      title: 'Featured Press Release',
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
        title: title || 'Unnamed',
        subtitle: date ? new Date(date).toLocaleDateString() : 'No date',
      };
    },
  },
};

