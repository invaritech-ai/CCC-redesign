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
      title: 'Event Date & Time',
      type: 'datetime',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'time',
      title: 'Display Time',
      type: 'string',
      description: 'Optional: Custom time display format (e.g., "2:00 PM - 4:00 PM")',
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
      name: 'registrationLink',
      title: 'Registration Link',
      type: 'url',
      description: 'External URL for event registration',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Social', value: 'social' },
          { title: 'Educational', value: 'educational' },
          { title: 'Health & Wellness', value: 'health-wellness' },
          { title: 'Cultural', value: 'cultural' },
          { title: 'Volunteer', value: 'volunteer' },
          { title: 'Fundraising', value: 'fundraising' },
          { title: 'Other', value: 'other' },
        ],
      },
    },
    {
      name: 'organizer',
      title: 'Organizer Information',
      type: 'object',
      fields: [
        {
          name: 'name',
          title: 'Organizer Name',
          type: 'string',
        },
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
      ],
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
      category: 'category',
    },
    prepare({ title, date, category }: any) {
      return {
        title,
        subtitle: `${date ? new Date(date).toLocaleDateString() : 'No date'}${category ? ` • ${category}` : ''}`,
      };
    },
  },
};

