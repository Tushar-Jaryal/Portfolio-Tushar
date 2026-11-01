import React from 'react'

export const PRIVACY_TITLE = 'Privacy Policy'
export const PRIVACY_UPDATED = '1 November 2026'

/** Shared by the /privacy page and the in-page legal dialog. */
export default function PrivacyContent() {
  return (
    <>
      <h2>Who is responsible</h2>
      <p>
        This website, tusharjaryal.in, is run by Tushar Jaryal, Chiayi, Taiwan (&ldquo;I&rdquo;,
        &ldquo;me&rdquo;). For any privacy question or request, email{' '}
        <a href="mailto:me@tusharjaryal.in">me@tusharjaryal.in</a>.
      </p>

      <h2>What I collect and why</h2>
      <ul>
        <li>
          <strong>Visiting the site.</strong> When you visit, your IP address, browser type, the
          page requested and the time are processed by Cloudflare and logged by my server. I use
          this only to deliver the site, keep it secure and fix problems. Server logs are kept for
          up to 15 days.
        </li>
        <li>
          <strong>Leaving a recommendation.</strong> If you choose to write a recommendation, I
          collect your name and email address to send you a sign-in link, and then your role, your
          relationship to me and the text of your recommendation. Your name, role, relationship and
          recommendation text may be shown publicly on this site. Your email address is never shown.
          I keep this until you ask me to remove it.
        </li>
        <li>
          <strong>Emailing me.</strong> If you email me, I receive your email address and message
          and use them only to reply.
        </li>
      </ul>
      <p>
        I do not use analytics, advertising or tracking tools, and I do not sell or share your data
        for marketing.
      </p>

      <h2>Legal basis</h2>
      <p>
        Visit data is processed because I have a legitimate interest in running a secure website.
        Recommendation data is processed with your consent, which you can withdraw at any time.
      </p>

      <h2>Cookies</h2>
      <div className="legal-table-wrap">
        <table className="legal-table">
          <thead>
            <tr>
              <th scope="col">Cookie</th>
              <th scope="col">Set by</th>
              <th scope="col">Purpose</th>
              <th scope="col">Lasts</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>payload-token</td>
              <td>this site</td>
              <td>
                Keeps you signed in after you use a sign-in link (recommenders and the site admin
                only)
              </td>
              <td>60 days</td>
            </tr>
            <tr>
              <td>__cf_bm, cf_clearance</td>
              <td>Cloudflare</td>
              <td>Protects the site from bots and abuse</td>
              <td>30 minutes to about a year</td>
            </tr>
            <tr>
              <td>cookie_notice</td>
              <td>this site</td>
              <td>Remembers that you closed the cookie notice</td>
              <td>12 months</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        All of these are strictly necessary, so they do not need consent. You can block or delete
        cookies in your browser, but signing in may then not work.
      </p>

      <h2>Who helps me run the site</h2>
      <p>I use a few service providers who process data on my behalf:</p>
      <ul>
        <li>
          Contabo GmbH (Germany): server hosting. The site and its database are stored in Germany.
        </li>
        <li>
          Cloudflare, Inc. (USA): content delivery and security. Cloudflare processes visitor IP
          addresses worldwide.
        </li>
        <li>Zoho Corporation (India): sends the sign-in emails.</li>
      </ul>
      <p>
        Some of these providers are outside your country. Where required, they use standard
        safeguards such as the EU Standard Contractual Clauses.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask me to show you, correct or delete the data I hold about you, or to stop using
        it. You can withdraw consent for your recommendation at any time and I will remove it.
        Depending on where you live, you may have extra rights under laws such as the EU/UK GDPR,
        India&rsquo;s Digital Personal Data Protection Act 2023 or Taiwan&rsquo;s Personal Data
        Protection Act, including the right to complain to your local data protection authority.
        Email <a href="mailto:me@tusharjaryal.in">me@tusharjaryal.in</a> and I will reply within 30
        days.
      </p>

      <h2>Security</h2>
      <p>
        The site is served only over HTTPS, sign-in cookies cannot be read by scripts, and the
        server is kept up to date. No system is perfectly secure, but I take reasonable care to
        protect your data.
      </p>

      <h2>Children</h2>
      <p>This site is not aimed at children under 16, and I do not knowingly collect their data.</p>

      <h2>Changes</h2>
      <p>If I change this policy, I will update the date at the top of this page.</p>
    </>
  )
}
