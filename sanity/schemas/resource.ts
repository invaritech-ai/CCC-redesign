export default {
  name: 'resource',
  title: 'Resource',
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
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'file',
      title: 'File Upload',
      type: 'file',
      description: 'Upload PDF, DOC, or other document files',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Forms', value: 'forms' },
          { title: 'Guides', value: 'guides' },
          { title: 'Reports', value: 'reports' },
          { title: 'Policies', value: 'policies' },
          { title: 'Brochures', value: 'brochures' },
          { title: 'Other', value: 'other' },
        ],
      },
    },
    {
      name: 'featured',
      title: 'Featured Resource',
      type: 'boolean',
      default: false,
    },
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'file',
    },
    prepare({ title, category }: any) {
      return {
        title: title || 'Unnamed',
        subtitle: category || 'No category',
      };
    },
  },
};

