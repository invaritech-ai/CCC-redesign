export default {
  name: 'caseStudy',
  title: 'Case Study',
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
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    },
    {
      name: 'outcomes',
      title: 'Outcomes',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Key outcomes or results of this case study',
    },
    {
      name: 'client',
      title: 'Client / Beneficiary',
      type: 'string',
      description: 'Name of the client, beneficiary, or organization involved',
    },
    {
      name: 'date',
      title: 'Date',
      type: 'date',
      description: 'Date when the case study was completed or published',
    },
    {
      name: 'featured',
      title: 'Featured Case Study',
      type: 'boolean',
      default: false,
    },
  ],
  preview: {
    select: {
      title: 'title',
      client: 'client',
      date: 'date',
      media: 'images.0',
    },
    prepare({ title, client, date }: any) {
      return {
        title: title || 'Unnamed',
        subtitle: `${client || 'No client'}${date ? ` • ${new Date(date).toLocaleDateString()}` : ''}`,
      };
    },
  },
};

