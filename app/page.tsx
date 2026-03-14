'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getCurrentUser } from '@/lib/store'

export default function Home() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <span className="text-sm font-bold text-white">IM</span>
              </div>
              <span className="text-lg font-semibold text-slate-900">Incident Manager</span>
            </div>
            <div className="flex items-center gap-4">
              {currentUser ? (
                <>
                  <span className="text-sm text-slate-600">Welcome, {currentUser.name}</span>
                  <Button onClick={() => router.push(`/dashboard/${currentUser.role === 'support_engineer' ? 'support' : currentUser.role}`)} className="bg-blue-600 hover:bg-blue-700">
                    Go to Dashboard
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => router.push('/login')} variant="outline">
                    Sign In
                  </Button>
                  <Button onClick={() => router.push('/register')} className="bg-blue-600 hover:bg-blue-700">
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 lg:py-16">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              Smart Incident
              <span className="block text-blue-600">Management System</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600">
              Streamline your incident response workflow with AI-powered insights, real-time collaboration, and comprehensive analytics. Track, manage, and resolve incidents faster than ever.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              {!currentUser && (
                <>
                  <Button onClick={() => router.push('/register')} size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Start Free Trial
                  </Button>
                  <Button onClick={() => router.push('/login')} size="lg" variant="outline">
                    Sign In to Account
                  </Button>
                </>
              )}
            </div>
            <p className="mt-6 text-sm text-slate-500">
              No credit card required. Start managing incidents in minutes.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-0 bg-white p-6 shadow-sm">
              <div className="text-3xl font-bold text-blue-600">99.9%</div>
              <div className="mt-2 text-sm text-slate-600">Uptime SLA</div>
            </Card>
            <Card className="border-0 bg-white p-6 shadow-sm">
              <div className="text-3xl font-bold text-blue-600">24/7</div>
              <div className="mt-2 text-sm text-slate-600">Support Available</div>
            </Card>
            <Card className="border-0 bg-white p-6 shadow-sm">
              <div className="text-3xl font-bold text-blue-600">500+</div>
              <div className="mt-2 text-sm text-slate-600">Teams Managed</div>
            </Card>
            <Card className="border-0 bg-white p-6 shadow-sm">
              <div className="text-3xl font-bold text-blue-600">2m</div>
              <div className="mt-2 text-sm text-slate-600">Avg Response Time</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-slate-200 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Powerful Features</h2>
            <p className="mt-4 text-lg text-slate-600">Everything you need to manage incidents efficiently</p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                title: 'Real-Time Collaboration',
                description: 'Work together seamlessly with your team on incident resolution with live updates and comments.',
              },
              {
                title: 'AI-Powered Insights',
                description: 'Get smart recommendations and analytics to identify patterns and prevent future incidents.',
              },
              {
                title: 'Role-Based Access',
                description: 'Manage teams with customizable roles - Users, Engineers, Managers, and Admins.',
              },
              {
                title: 'Priority Management',
                description: 'Organize incidents by severity and priority to focus on what matters most.',
              },
              {
                title: 'Comprehensive Dashboard',
                description: 'Get actionable insights with role-specific dashboards and detailed analytics.',
              },
              {
                title: 'Team Invitations',
                description: 'Invite team members with specific roles and manage access with ease.',
              },
            ].map((feature, i) => (
              <Card key={i} className="border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-slate-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Roles & Permissions</h2>
            <p className="mt-4 text-lg text-slate-600">Different access levels for different team members</p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                role: 'User',
                description: 'Report and track personal incidents',
                permissions: ['Create incidents', 'View own incidents', 'Add updates'],
              },
              {
                role: 'Support Engineer',
                description: 'Manage and resolve assigned incidents',
                permissions: ['Claim incidents', 'Update status', 'Add comments', 'Assign work'],
              },
              {
                role: 'Manager',
                description: 'Monitor team performance and analytics',
                permissions: ['View analytics', 'Team workload', 'Performance metrics', 'View all incidents'],
              },
              {
                role: 'Admin',
                description: 'Full system control and user management',
                permissions: ['Manage users', 'Invite team', 'System settings', 'Full access'],
              },
            ].map((item, i) => (
              <Card key={i} className="border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900">{item.role}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                <ul className="mt-4 space-y-2">
                  {item.permissions.map((perm, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-slate-700">
                      <span className="text-blue-600">✓</span>
                      {perm}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-slate-200 bg-blue-600 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to transform your incident management?</h2>
          <p className="mt-6 text-lg text-blue-100">Join teams worldwide using our platform to resolve incidents faster.</p>
          {!currentUser && (
            <div className="mt-8 flex justify-center gap-4">
              <Button onClick={() => router.push('/register')} size="lg" className="bg-white text-blue-600 hover:bg-slate-50">
                Get Started Free
              </Button>
              <Button onClick={() => router.push('/login')} size="lg" variant="outline" className="border-white text-white hover:bg-blue-700">
                Sign In
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-900 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-slate-400">© 2024 Incident Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
