import { defineType, defineField } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string", initialValue: "// about" }),
    defineField({ name: "heading", title: "Heading", type: "text", rows: 2 }),
    defineField({ name: "bio", title: "Bio", type: "portableText" }),
    defineField({ name: "portrait", title: "Portrait", type: "accessibleImage" }),
    defineField({
      name: "metaLines",
      title: "Meta lines (location/status/coffee)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "key", type: "string" },
            { name: "value", type: "string" },
          ],
          preview: { select: { title: "key", subtitle: "value" } },
        },
      ],
    }),
    defineField({
      name: "skillGroups",
      title: "Skill groups",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Label" },
            { name: "items", type: "array", of: [{ type: "string" }], options: { layout: "tags" } },
          ],
          preview: { select: { title: "label" } },
        },
      ],
    }),
    defineField({
      name: "timeline",
      title: "Experience timeline",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "span", type: "string", title: "Span" },
            { name: "role", type: "string", title: "Role" },
            { name: "org", type: "string", title: "Org" },
            { name: "note", type: "text", rows: 2, title: "Note" },
          ],
          preview: { select: { title: "role", subtitle: "org" } },
        },
      ],
    }),
    defineField({
      name: "beliefs",
      title: "How I work (beliefs)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "n", type: "string", title: "Number" },
            { name: "h", type: "string", title: "Heading" },
            { name: "t", type: "text", rows: 2, title: "Text" },
          ],
          preview: { select: { title: "h", subtitle: "n" } },
        },
      ],
    }),
    defineField({
      name: "achievements",
      title: "Achievements (publications, certs, awards)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "kind",
              type: "string",
              title: "Kind",
              options: { list: ["publication", "certification", "award"] },
            },
            { name: "title", type: "string", title: "Title" },
            { name: "meta", type: "string", title: "Venue / issuer" },
            { name: "year", type: "string", title: "Year" },
            { name: "href", type: "url", title: "Link (optional)" },
          ],
          preview: { select: { title: "title", subtitle: "meta" } },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "About Page" }) },
});
