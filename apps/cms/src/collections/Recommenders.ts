import type { CollectionConfig } from 'payload'
import { getPublicServerURL, RECOMMENDER_TOKEN_EXPIRATION_SECONDS } from '@/lib/site'

const VERIFY_PATH = '/recommend/verify'

/**
 * Separate login for outside recommenders (professors/employers) — never
 * touches admin.user, so a recommender account can never reach /admin.
 * "Login" is passwordless: see src/app/(frontend)/recommend/api/request-link
 * and .../verify, which reuse Payload's own forgotPassword/resetPassword
 * operations as a magic link instead of a real password flow.
 */
export const Recommenders: CollectionConfig = {
  slug: 'recommenders',
  admin: { useAsTitle: 'email', defaultColumns: ['email', 'name', 'role', 'relationship'] },
  auth: {
    // 60-day sessions so a returning recommender can just keep editing
    // without needing a fresh magic link every visit.
    tokenExpiration: RECOMMENDER_TOKEN_EXPIRATION_SECONDS,
    forgotPassword: {
      generateEmailSubject: () => 'Sign in to write your recommendation',
      generateEmailHTML: (args) => {
        const url = `${getPublicServerURL()}${VERIFY_PATH}?token=${args?.token ?? ''}`
        return `<p>Click the link below to sign in and write (or edit) your recommendation for Tushar Jaryal.</p>
<p><a href="${url}">${url}</a></p>
<p>This link expires in 1 hour and can only be used once. If you didn't request this, you can ignore this email.</p>`
      },
    },
  },
  access: {
    create: () => true,
    read: ({ req }) => {
      if (req.user?.collection === 'recommenders') return { id: { equals: req.user.id } }
      return req.user?.collection === 'users'
    },
    update: ({ req, data }) => {
      // Block here, not in a beforeChange hook — Payload's update operation
      // captures data.password before any beforeChange hook runs
      // (collections/operations/utilities/update.js reads it at the very
      // top of updateDocument), so mutating/deleting it in a hook has no
      // effect on whether the password actually gets changed. Denying the
      // whole request at the access-control stage runs early enough to
      // actually work. resetPassword (the real magic-link mechanism) writes
      // the hash directly via the DB adapter, bypassing this entirely.
      if (data?.password) return false
      if (req.user?.collection === 'recommenders') return { id: { equals: req.user.id } }
      return req.user?.collection === 'users'
    },
    delete: ({ req }) => req.user?.collection === 'users',
  },
  hooks: {
    beforeChange: [
      ({ data, originalDoc, operation }) => {
        // Never trust a client-supplied password on create — see
        // access.update above for why the equivalent update-time block has
        // to live in access control instead of here.
        if (operation === 'create') {
          data.password = crypto.randomUUID()
        }

        // forgotPassword's internal update (setting resetPasswordToken) is the
        // one path every magic-link request goes through, whether it comes
        // from /recommend/api/request-link or straight from Payload's own
        // POST /api/recommenders/forgot-password (which has no cooldown of
        // its own). Enforcing the cooldown here instead closes that
        // direct-REST bypass. Timed off a dedicated lastLinkRequestedAt
        // field rather than updatedAt — updatedAt is bumped by unrelated
        // writes too (e.g. saving your name/role from the dashboard), which
        // would otherwise wrongly block a legitimate link request that just
        // happens to follow a profile edit.
        // Truthy check, not `in` — Payload also touches (clears to null)
        // resetPasswordToken as a side effect of any password-field update,
        // which would otherwise false-positive here and block an unrelated
        // change with the cooldown error. Only a genuine forgotPassword call
        // sets it to an actual new token value.
        if (operation === 'update' && data.resetPasswordToken) {
          const lastRequestedAt = originalDoc?.lastLinkRequestedAt
            ? new Date(originalDoc.lastLinkRequestedAt).getTime()
            : null
          if (lastRequestedAt !== null && Date.now() - lastRequestedAt < 60_000) {
            throw new Error('Please wait a minute before requesting another sign-in link.')
          }
          data.lastLinkRequestedAt = new Date().toISOString()
        }

        return data
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', admin: { description: 'e.g. "Thesis Advisor, CCU"' } },
    {
      name: 'relationship',
      type: 'select',
      options: ['manager', 'professor', 'colleague', 'client', 'partner'],
    },
    {
      name: 'lastLinkRequestedAt',
      type: 'date',
      admin: { hidden: true, description: 'Cooldown timer for magic-link requests — not user-facing.' },
    },
  ],
}
