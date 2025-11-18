export default {
  name: "formBuilder",
  title: "Form Builder",
  type: "document",
  fields: [
    {
      name: "formName",
      title: "Form Name",
      type: "string",
      description: "Display name for the form",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "formDescription",
      title: "Form Description",
      type: "string",
      description: "Description/meta description for the form (max 160 characters)",
      validation: (Rule: any) => Rule.max(160),
    },
    {
      name: "pageSlug",
      title: "Page to Show Form On",
      type: "string",
      description: "Select which page this form should appear on",
      options: {
        list: [
          { title: "Contact", value: "contact" },
          { title: "Community", value: "community" },
          { title: "Waitlist", value: "waitlist" },
          { title: "Volunteer", value: "volunteer" },
          { title: "Support/Donate", value: "support/donate" },
          { title: "Reports", value: "reports" },
          { title: "Updates", value: "updates" },
          { title: "Events", value: "events" },
          { title: "Privacy", value: "privacy" },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "googleSheetUrl",
      title: "Google Sheet URL",
      type: "url",
      description: "Google Sheet URL where form submissions will be written",
      validation: (Rule: any) => Rule.required().uri({ scheme: ["https"] }),
    },
    {
      name: "fields",
      title: "Form Fields",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "fieldName",
              title: "Field Name",
              type: "string",
              description: "Label for the field",
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "fieldType",
              title: "Field Type",
              type: "string",
              description: "Type of input field",
              options: {
                list: [
                  { title: "Text", value: "text" },
                  { title: "Textarea", value: "textarea" },
                  { title: "Boolean (Checkbox)", value: "boolean" },
                  { title: "File Upload", value: "upload" },
                ],
              },
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "required",
              title: "Required",
              type: "boolean",
              description: "Whether this field is required",
              initialValue: false,
            },
            {
              name: "placeholder",
              title: "Placeholder Text",
              type: "string",
              description: "Optional placeholder text for the field",
            },
            {
              name: "order",
              title: "Display Order",
              type: "number",
              description: "Order in which fields appear (lower numbers appear first)",
              validation: (Rule: any) => Rule.min(0),
            },
          ],
          preview: {
            select: {
              fieldName: "fieldName",
              fieldType: "fieldType",
              required: "required",
            },
            prepare({ fieldName, fieldType, required }: any) {
              return {
                title: fieldName || "Unnamed Field",
                subtitle: `${fieldType || "text"}${required ? " (required)" : ""}`,
              };
            },
          },
        },
      ],
      validation: (Rule: any) => Rule.required().min(1),
    },
  ],
  preview: {
    select: {
      formName: "formName",
      pageSlug: "pageSlug",
    },
    prepare({ formName, pageSlug }: any) {
      return {
        title: formName || "Unnamed Form",
        subtitle: `Page: ${pageSlug || "No page"}`,
      };
    },
  },
};

