import { defineType, defineField } from "sanity";

/** Reusable image with accessibility metadata baked in (alt required unless decorative). */
export const accessibleImage = defineType({
  name: "accessibleImage",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description: "Describe the image for screen readers. Required unless decorative.",
      validation: (Rule) =>
        Rule.custom((alt, context) => {
          const parent = context.parent as { decorative?: boolean };
          if (parent?.decorative) return true;
          return alt && alt.trim().length > 0
            ? true
            : "Alt text is required (or mark the image as decorative).";
        }),
    }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
    defineField({ name: "credit", title: "Credit", type: "string" }),
    defineField({
      name: "decorative",
      title: "Decorative (no alt needed)",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
