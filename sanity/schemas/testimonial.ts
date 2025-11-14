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
      title: 'Role / Position',
      type: 'string',
      description: 'e.g., Community Member, Family Member, Volunteer, Board Member',
    },
    {
      name: 'company',
      title: 'Company / Organization',
      type: 'string',
      description: 'Company or organization name (if applicable)',
    },
    {
      name: 'detail',
      title: 'Additional Detail',
      type: 'string',
      description: 'e.g., Member since 2015, Resident\'s Daughter',
    },
    {
      name: 'date',
      title: 'Testimonial Date',
      type: 'date',
      description: 'Date when the testimonial was given',
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
      company: 'company',
      quote: 'quote',
      date: 'date',
    },
    prepare({ title, role, company, quote, date }: any) {
      const subtitle = [role, company].filter(Boolean).join(' • ') || 'No role';
      return {
        title: title || 'Unnamed',
        subtitle: `${subtitle}${date ? ` • ${new Date(date).toLocaleDateString()}` : ''}`,
        description: quote ? quote.substring(0, 50) + '...' : 'No quote',
      };
    },
  },
};

