export default {
  name: 'update',
  title: 'Update / Story',
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
      name: 'type',
      title: 'Content Type',
      type: 'string',
      options: {
        list: [
          { title: 'News', value: 'news' },
          { title: 'Announcement', value: 'announcement' },
          { title: 'Story', value: 'story' },
          { title: 'Article', value: 'article' },
        ],
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
      name: 'author',
      title: 'Author',
      type: 'string',
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
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Community', value: 'community' },
          { title: 'Events', value: 'events' },
          { title: 'Services', value: 'services' },
          { title: 'Impact', value: 'impact' },
          { title: 'Volunteers', value: 'volunteers' },
          { title: 'Stories', value: 'stories' },
        ],
      },
    },
    {
      name: 'relatedEvent',
      title: 'Related Event',
      type: 'reference',
      to: [{ type: 'event' }],
    },
    {
      name: 'relatedLinks',
      title: 'Related Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Link Title',
              type: 'string',
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
            },
          ],
        },
      ],
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
      type: 'type',
    },
    prepare({ title, publishedAt, type }: any) {
      return {
        title,
        subtitle: `${type || 'update'} • ${publishedAt ? new Date(publishedAt).toLocaleDateString() : 'No date'}`,
      };
    },
  },
};

