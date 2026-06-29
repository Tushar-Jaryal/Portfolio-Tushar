import { defineType, defineField } from "sanity";

export const post = defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (R) => R.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({ name: "date", title: "Date", type: "date", validation: (R) => R.required() }),
    defineField({ name: "readingTime", title: "Reading time", type: "string", description: 'e.g. "8 min"' }),
    defineField({ name: "tags", title: "Tags", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 3 }),
    defineField({ name: "featured", title: "Featured (blog hero)", type: "boolean", initialValue: false }),
    defineField({ name: "cover", title: "Cover image", type: "accessibleImage" }),
    defineField({ name: "body", title: "Body", type: "portableText" }),
    defineField({
      name: "related",
      title: "Related posts",
      type: "array",
      of: [{ type: "reference", to: [{ type: "post" }] }],
      validation: (R) => R.max(3),
    }),
  ],
  orderings: [
    { title: "Newest first", name: "dateDesc", by: [{ field: "date", direction: "desc" }] },
  ],
  preview: { select: { title: "title", subtitle: "date", media: "cover" } },
});
