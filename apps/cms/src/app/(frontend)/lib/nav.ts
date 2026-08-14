import type { SiteSetting } from '@/payload-types'

export function toNavItems(settings: SiteSetting): { label: string; href: string }[] {
  return (settings.navItems ?? []).map((n) => ({ label: n.label || '', href: n.href || '#' }))
}
