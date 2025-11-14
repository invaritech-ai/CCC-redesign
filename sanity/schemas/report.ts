export default {
  name: 'report',
  title: 'Report',
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
      name: 'summary',
      title: 'Summary',
      type: 'text',
      description: 'Brief summary of the report',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'author',
      title: 'Author / Organization',
      type: 'string',
    },
    {
      name: 'relatedTopics',
      title: 'Related Topics',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
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
      author: 'author',
    },
    prepare({ title, year, author }: any) {
      return {
        title,
        subtitle: `${year ? `Year: ${year}` : 'No year'}${author ? ` • ${author}` : ''}`,
      };
    },
  },
};

