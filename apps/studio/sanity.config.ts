import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";

// Singleton documents (one editable instance each). Listed once so the desk
// structure can pin them and hide the "create new" action.
const SINGLETONS = [
  { id: "siteSettings", title: "Site Settings" },
  { id: "homePage", title: "Home Page" },
  { id: "aboutPage", title: "About Page" },
  { id: "projectsPage", title: "Projects Page" },
  { id: "blogPage", title: "Blog Page" },
  { id: "recommendationsPage", title: "Recommendations Page" },
  { id: "contactPage", title: "Contact Page" },
];
const SINGLETON_IDS = new Set(SINGLETONS.map((s) => s.id));

export default defineConfig({
  name: "default",
  title: "Tushar Jaryal — Portfolio",

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "your_project_id",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            // Pinned singletons
            ...SINGLETONS.map((s) =>
              S.listItem()
                .title(s.title)
                .id(s.id)
                .child(S.document().schemaType(s.id).documentId(s.id)),
            ),
            S.divider(),
            // Collections
            S.documentTypeListItem("project").title("Projects"),
            S.documentTypeListItem("post").title("Blog Posts"),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    // Prevent creating/deleting extra copies of singletons.
    templates: (templates) =>
      templates.filter((t) => !SINGLETON_IDS.has(t.schemaType)),
  },

  document: {
    actions: (input, context) =>
      SINGLETON_IDS.has(context.schemaType)
        ? input.filter(
            ({ action }) =>
              action &&
              ["publish", "discardChanges", "restore"].includes(action),
          )
        : input,
  },
});
