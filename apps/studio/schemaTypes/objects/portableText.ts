import { defineType, defineArrayMember } from "sanity";

/** Rich text for blog bodies & project case-study sections.
 *  Matches the styles in the Post mockup: headings, lists, code blocks, pull-quotes, images. */
export const portableText = defineType({
  name: "portableText",
  title: "Rich text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading", value: "h2" },
        { title: "Subheading", value: "h3" },
        { title: "Pull quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
          { title: "Code", value: "code" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [{ name: "href", type: "url", title: "URL" }],
          },
        ],
      },
    }),
    defineArrayMember({ type: "accessibleImage" }),
    defineArrayMember({
      type: "object",
      name: "codeBlock",
      title: "Code block",
      fields: [
        { name: "language", type: "string", title: "Language" },
        { name: "code", type: "text", title: "Code", rows: 8 },
      ],
      preview: {
        select: { title: "language", subtitle: "code" },
        prepare: ({ title, subtitle }) => ({
          title: title ? `code · ${title}` : "code",
          subtitle,
        }),
      },
    }),
  ],
});
