'use client'

import { ReactNode } from 'react'
import { Navigation } from './navigation'

interface PageLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
}

export function PageLayout({ children, title, subtitle }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="flex-1">
        {title && (
          <div className="border-b border-border px-8 py-6">
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        )}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
