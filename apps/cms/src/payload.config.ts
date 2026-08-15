import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { Projects } from './collections/Projects'
import { Posts } from './collections/Posts'
import { Recommenders } from './collections/Recommenders'
import { Recommendations } from './collections/Recommendations'
import { SiteSettings } from './globals/SiteSettings'
import { HomePage } from './globals/HomePage'
import { AboutPage } from './globals/AboutPage'
import { ProjectsPage } from './globals/ProjectsPage'
import { BlogPage } from './globals/BlogPage'
import { RecommendationsPage } from './globals/RecommendationsPage'
import { ContactPage } from './globals/ContactPage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Only build a real SMTP adapter when creds are actually present (i.e. at
// runtime in the cluster, via the smtp-credentials secret) — not at `next
// build` time, where SMTP_HOST is unset and we don't want a network
// dependency. Payload falls back to its own default (console-logged) adapter
// when `email` is omitted, matching prior behavior.
const emailAdapter = process.env.SMTP_HOST
  ? await nodemailerAdapter({
      defaultFromAddress: process.env.SMTP_FROM || 'tushar@tusharjaryal.in',
      defaultFromName: 'Tushar Jaryal',
      skipVerify: true,
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
    })
  : undefined

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'https://tusharjaryal.in',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: dirname,
    },
    // /admin is only gated by Payload's own auth now — studio.tusharjaryal.in
    // (which sat behind Cloudflare Access) was retired; everything is served
    // from tusharjaryal.in.
  },
  collections: [Users, Media, Projects, Posts, Recommenders, Recommendations],
  globals: [SiteSettings, HomePage, AboutPage, ProjectsPage, BlogPage, RecommendationsPage, ContactPage],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  email: emailAdapter,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  cors: [
    'https://tusharjaryal.in',
    'https://www.tusharjaryal.in',
  ],
  sharp,
})
