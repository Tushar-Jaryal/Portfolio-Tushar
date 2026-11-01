import React from 'react'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { getPayload } from 'payload'
import config from '@/payload.config'
import CookieBanner from './components/CookieBanner'
import './styles.css'

export const dynamic = 'force-dynamic'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-heading',
  display: 'swap',
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export async function generateMetadata() {
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'siteSettings' })

  return {
    title: settings?.seo?.title || 'Tushar Jaryal',
    description: settings?.seo?.description || '',
  }
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetBrainsMono.variable}`}>
      <body>
        {children}
        <CookieBanner />
      </body>
    </html>
  )
}
