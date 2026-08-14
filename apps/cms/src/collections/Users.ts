import type { CollectionConfig } from 'payload'

/** Admin login for the Payload dashboard (replaces Sanity's project members). */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email' },
  access: {
    // Must check collection, not just Boolean(req.user) — a logged-in
    // Recommender is also req.user, from a different collection, and must
    // never be able to read the admin list or create a Users account.
    read: ({ req }) => req.user?.collection === 'users',
    // Payload's own first-user bootstrap flow (/admin/create-first-user) bypasses
    // this when the collection is empty, so the initial admin can still sign up.
    // Once any user exists, only an already-authenticated admin may create another.
    create: ({ req }) => req.user?.collection === 'users',
    // update/delete must be just as strict — left to Payload's default
    // (Boolean(user)) these would let a logged-in Recommender edit or
    // delete the admin account.
    update: ({ req }) => req.user?.collection === 'users',
    delete: ({ req }) => req.user?.collection === 'users',
  },
  fields: [],
}
