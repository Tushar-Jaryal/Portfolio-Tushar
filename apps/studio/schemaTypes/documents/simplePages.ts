import { defineType, defineField } from "sanity";

const eyebrow = (val: string) =>
  defineField({ name: "eyebrow", title: "Eyebrow", type: "string", initialValue: val });
const heading = defineField({ name: "heading", title: "Heading", type: "string" });
const intro = defineField({ name: "intro", title: "Intro", type: "text", rows: 2 });

export const projectsPage = defineType({
  name: "projectsPage",
  title: "Projects Page",
  type: "document",
  fields: [
    eyebrow("// projects"),
    heading,
    intro,
    defineField({ name: "filters", title: "Filter categories", type: "array", of: [{ type: "string" }] }),
  ],
  preview: { prepare: () => ({ title: "Projects Page" }) },
});

export const blogPage = defineType({
  name: "blogPage",
  title: "Blog Page",
  type: "document",
  fields: [
    eyebrow("// blog"),
    heading,
    intro,
    defineField({ name: "featured", title: "Featured post", type: "reference", to: [{ type: "post" }] }),
    defineField({ name: "newsletterHeading", title: "Newsletter heading", type: "string" }),
    defineField({ name: "newsletterSubtext", title: "Newsletter subtext", type: "string" }),
  ],
  preview: { prepare: () => ({ title: "Blog Page" }) },
});

export const recommendationsPage = defineType({
  name: "recommendationsPage",
  title: "Recommendations Page",
  type: "document",
  fields: [
    eyebrow("// recommendations"),
    heading,
    intro,
    defineField({
      name: "recommendations",
      title: "Recommendations",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "quote", type: "text", rows: 4, title: "Quote" },
            { name: "name", type: "string", title: "Name" },
            { name: "role", type: "string", title: "Role" },
            { name: "initials", type: "string", title: "Initials" },
            {
              name: "relationship",
              type: "string",
              title: "Relationship",
              options: { list: ["manager", "professor", "colleague", "client", "partner"] },
            },
          ],
          preview: { select: { title: "name", subtitle: "role" } },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Recommendations Page" }) },
});

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  fields: [
    eyebrow("// contact"),
    heading,
    intro,
    defineField({
      name: "directLinks",
      title: "Direct links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Label" },
            { name: "value", type: "string", title: "Value" },
            { name: "href", type: "url", title: "Href", validation: (R) => R.uri({ allowRelative: true, scheme: ["http", "https", "mailto"] }) },
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        },
      ],
    }),
    defineField({
      name: "availability",
      title: "Availability block",
      type: "object",
      fields: [
        { name: "timezone", type: "string", title: "Timezone" },
        { name: "replies", type: "string", title: "Replies" },
        { name: "openTo", type: "array", of: [{ type: "string" }], title: "Open to" },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Contact Page" }) },
});
