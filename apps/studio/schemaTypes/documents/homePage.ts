import { defineType, defineField } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({ name: "available", title: "Show availability badge", type: "boolean", initialValue: true }),
    defineField({ name: "availabilityText", title: "Availability text", type: "string" }),
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({ name: "kanjiSubtitle", title: "Kanji subtitle", type: "string" }),
    defineField({ name: "tagline", title: "Tagline", type: "text", rows: 2 }),
    defineField({
      name: "typingWords",
      title: "Typing phrases",
      type: "array",
      of: [{ type: "string" }],
      description: "Cycled in the animated hero line.",
    }),
    defineField({
      name: "ctaButtons",
      title: "CTA buttons",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string" },
            { name: "href", type: "string" },
            { name: "primary", type: "boolean", initialValue: false },
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        },
      ],
    }),
    defineField({
      name: "whoamiLines",
      title: "whoami terminal lines",
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
      name: "featuredProjects",
      title: "Featured projects",
      type: "array",
      of: [{ type: "reference", to: [{ type: "project" }] }],
      validation: (R) => R.max(4),
    }),
    defineField({
      name: "featuredPosts",
      title: "Featured posts",
      type: "array",
      of: [{ type: "reference", to: [{ type: "post" }] }],
      validation: (R) => R.max(4),
    }),
    defineField({
      name: "stackItems",
      title: "Stack marquee items",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "ctaHeading", title: "CTA heading", type: "text", rows: 2 }),
    defineField({ name: "ctaButtonLabel", title: "CTA button label", type: "string" }),
    defineField({ name: "ctaButtonHref", title: "CTA button href", type: "string" }),
  ],
  preview: { prepare: () => ({ title: "Home Page" }) },
});
