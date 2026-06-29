import { defineType, defineField } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (R) => R.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({ name: "number", title: "Display number", type: "string", description: 'e.g. "01"' }),
    defineField({ name: "order", title: "Sort order", type: "number", initialValue: 0 }),
    defineField({ name: "year", title: "Year", type: "string" }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: ["ml infra", "mlops", "dev tools", "oss"],
      },
    }),
    defineField({ name: "tags", title: "Tags", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "featured", title: "Featured on home", type: "boolean", initialValue: false }),
    defineField({ name: "cover", title: "Card cover", type: "accessibleImage" }),
    defineField({ name: "shotCaption", title: "Shot caption", type: "string", description: "Placeholder label shown over the thumbnail in the design." }),
    defineField({ name: "summary", title: "Summary (card)", type: "text", rows: 3 }),
    defineField({ name: "hero", title: "Hero image", type: "accessibleImage" }),
    defineField({ name: "intro", title: "Intro paragraph", type: "text", rows: 3 }),
    defineField({ name: "role", title: "Role", type: "string" }),
    defineField({ name: "status", title: "Status", type: "string" }),
    defineField({ name: "stack", title: "Stack", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({
      name: "stats",
      title: "Stats",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "value", type: "string", title: "Value" },
            { name: "label", type: "string", title: "Label" },
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        },
      ],
    }),
    defineField({ name: "problem", title: "The problem", type: "portableText" }),
    defineField({ name: "approach", title: "The approach", type: "portableText" }),
    defineField({ name: "outcome", title: "The outcome", type: "portableText" }),
    defineField({
      name: "testimonial",
      title: "Testimonial",
      type: "object",
      fields: [
        { name: "quote", type: "text", rows: 3, title: "Quote" },
        { name: "attribution", type: "string", title: "Attribution" },
      ],
    }),
    defineField({
      name: "links",
      title: "Links",
      type: "object",
      fields: [
        { name: "source", type: "url", title: "Source" },
        { name: "demo", type: "url", title: "Live demo" },
      ],
    }),
  ],
  orderings: [
    { title: "Sort order", name: "order", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "name", subtitle: "year", media: "cover" } },
});
