import { defineType, defineField } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "glyph", title: "Logo glyph", type: "string", initialValue: "夏" }),
    defineField({ name: "brandName", title: "Brand name", type: "string" }),
    defineField({ name: "brandSuffix", title: "Brand suffix", type: "string" }),
    defineField({
      name: "navItems",
      title: "Nav items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Label" },
            { name: "href", type: "string", title: "Href" },
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        },
      ],
    }),
    defineField({ name: "footerLine", title: "Footer line", type: "string" }),
    defineField({ name: "copyright", title: "Copyright", type: "string" }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Label" },
            { name: "href", type: "url", title: "Href", validation: (R) => R.uri({ allowRelative: true }) },
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        },
      ],
    }),
    defineField({
      name: "seo",
      title: "Default SEO",
      type: "object",
      fields: [
        { name: "title", type: "string", title: "Default title" },
        { name: "description", type: "text", rows: 2, title: "Default description" },
        { name: "ogImage", type: "accessibleImage", title: "Default OG image" },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});
