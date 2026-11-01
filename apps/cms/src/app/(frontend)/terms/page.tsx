import React from 'react'
import LegalPage from '../components/LegalPage'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Terms and Conditions — Tushar Jaryal' }

export default function TermsPage() {
  return (
    <LegalPage title="Terms and Conditions" updated="1 November 2026">
      <h2>1. About these terms</h2>
      <p>
        These terms apply to your use of tusharjaryal.in, a personal portfolio website run by Tushar
        Jaryal, Chiayi, Taiwan. By using the site you accept them. If you do not agree, please do not
        use the site.
      </p>

      <h2>2. Content</h2>
      <p>
        The text, images, designs and other content on this site belong to me unless stated
        otherwise. You may view and share links to the site and quote small parts with credit. You may
        not copy, republish or sell the content without my written permission. Third-party names and
        logos belong to their owners.
      </p>

      <h2>3. Recommendations</h2>
      <p>
        If you submit a recommendation, you confirm that it is honest, is your own opinion, and does
        not break any law or anyone&rsquo;s rights. You allow me to show it, with your name, role and
        relationship, on this site and in my professional profiles. You can ask me to remove it at any
        time. I may edit it for length or formatting, or choose not to publish it.
      </p>

      <h2>4. Acceptable use</h2>
      <p>
        Do not try to break into, overload or disrupt the site, scrape it in a way that harms it, or
        use it for anything unlawful. Accounts and sign-in links are personal; do not share them.
      </p>

      <h2>5. No warranty</h2>
      <p>
        The site is provided &ldquo;as is&rdquo; for general information. I try to keep it accurate
        and online, but I do not promise it is error-free, complete or always available. Nothing on it
        is professional advice.
      </p>

      <h2>6. Limitation of liability</h2>
      <p>
        As far as the law allows, I am not liable for any loss or damage arising from your use of the
        site or from relying on its content. Nothing in these terms limits liability that cannot be
        limited by law.
      </p>

      <h2>7. Links</h2>
      <p>
        The site links to other websites such as GitHub and LinkedIn. I am not responsible for their
        content or their privacy practices.
      </p>

      <h2>8. Privacy</h2>
      <p>
        How I handle personal data is explained in the <a href="/privacy">Privacy Policy</a>.
      </p>

      <h2>9. Changes</h2>
      <p>I may update these terms. The date at the top shows the latest version.</p>

      <h2>10. Law</h2>
      <p>
        These terms are governed by the laws of Taiwan (Republic of China). This does not take away
        any rights you have under the consumer laws of your own country.
      </p>

      <h2>11. Contact</h2>
      <p>
        <a href="mailto:me@tusharjaryal.in">me@tusharjaryal.in</a>
      </p>
    </LegalPage>
  )
}
