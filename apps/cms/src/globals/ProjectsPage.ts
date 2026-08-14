import type { GlobalConfig } from 'payload'

/** Port of the `projectsPage` type in apps/studio/schemaTypes/documents/simplePages.ts */
export const ProjectsPage: GlobalConfig = {
  slug: 'projectsPage',
  admin: { group: 'Pages' },
  access: { read: () => true },
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: '// projects' },
    { name: 'heading', type: 'text' },
    { name: 'intro', type: 'textarea' },
    { name: 'filters', type: 'text', hasMany: true, label: 'Filter categories' },
  ],
}
