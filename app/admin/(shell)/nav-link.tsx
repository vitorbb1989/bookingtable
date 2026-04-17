'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function AdminNavLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))

  return (
    <Link
      href={href}
      className={`block rounded-md px-2.5 py-1.5 transition-colors ${
        active
          ? 'bg-neutral-100 text-neutral-900'
          : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
      }`}
    >
      {children}
    </Link>
  )
}
