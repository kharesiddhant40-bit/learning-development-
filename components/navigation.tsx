'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { getCurrentUser, logoutUser } from '@/lib/store'
import { User } from '@/lib/store'

export function Navigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const user = getCurrentUser()
    setCurrentUser(user)
  }, [])

  if (!isClient || !currentUser) return null

  const handleLogout = () => {
    logoutUser()
    router.push('/login')
  }

  const getDashboardLink = () => {
    switch (currentUser.role) {
      case 'admin':
        return '/dashboard/admin'
      case 'support_engineer':
        return '/dashboard/support'
      case 'manager':
        return '/dashboard/manager'
      case 'user':
        return '/dashboard/user'
      default:
        return '/dashboard'
    }
  }

  const navItems = [
    { href: getDashboardLink(), label: 'Dashboard' },
    { href: '/incidents', label: 'Incidents' },
  ]

  if (currentUser.role === 'admin') {
    navItems.push({ href: '/dashboard/admin/users', label: 'Users' })
  }

  return (
    <nav className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
        <Link href={getDashboardLink()} className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold">
            IM
          </div>
          <span className="font-semibold text-foreground">IncidentManager</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? 'default' : 'ghost'}
                className="text-sm"
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{currentUser.name}</span>
            <span className="text-xs ml-2 inline-block px-2 py-1 rounded bg-secondary text-secondary-foreground">
              {currentUser.role.replace('_', ' ')}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
}
