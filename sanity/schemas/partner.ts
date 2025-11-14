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
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Brief description of the partner and partnership',
    },
    {
      name: 'website',
      title: 'Website URL',
      type: 'url',
    },
    {
      name: 'partnershipType',
      title: 'Partnership Type',
      type: 'string',
      options: {
        list: [
          { title: 'Corporate Sponsor', value: 'corporate-sponsor' },
          { title: 'Community Partner', value: 'community-partner' },
          { title: 'Service Provider', value: 'service-provider' },
          { title: 'Volunteer Organization', value: 'volunteer-organization' },
          { title: 'Government', value: 'government' },
          { title: 'Other', value: 'other' },
        ],
      },
    },
    {
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'object',
      fields: [
        {
          name: 'email',
          title: 'Email',
          type: 'string',
        },
        {
          name: 'phone',
          title: 'Phone',
          type: 'string',
        },
        {
          name: 'address',
          title: 'Address',
          type: 'text',
        },
      ],
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
      partnershipType: 'partnershipType',
    },
    prepare({ title, partnershipType }: any) {
      return {
        title,
        subtitle: partnershipType || 'No type',
      };
    },
  },
};

