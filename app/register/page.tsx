'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { registerUser, getCurrentUser } from '@/lib/store'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'user' | 'support_engineer' | 'manager'>('user')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      router.push('/dashboard/user')
    }
  }, [router])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const user = registerUser(email, name, role)
      if (user) {
        const dashboardPath = role === 'support_engineer' ? 'support' : role
        router.push(`/dashboard/${dashboardPath}`)
      } else {
        setError('Email already exists')
      }
    } catch (err) {
      setError('An error occurred during registration')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="h-12 w-12 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold mx-auto mb-4">
            IM
          </div>
          <h1 className="text-3xl font-bold text-foreground">IncidentManager</h1>
          <p className="text-muted-foreground mt-2">AI-Based Smart Incident Management</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Create a new account to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <div className="p-3 bg-destructive/10 text-destructive rounded text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Role
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'user', label: 'User', description: 'Report incidents' },
                    { value: 'support_engineer', label: 'Support Engineer', description: 'Manage incidents' },
                    { value: 'manager', label: 'Manager', description: 'View analytics' },
                  ].map((option) => (
                    <label key={option.value} className="flex items-start gap-3 p-3 border border-input rounded-lg cursor-pointer hover:bg-accent transition-colors" style={{ borderColor: role === option.value ? 'rgb(37, 99, 235)' : undefined, backgroundColor: role === option.value ? 'rgb(239, 246, 255)' : undefined }}>
                      <input
                        type="radio"
                        name="role"
                        value={option.value}
                        checked={role === option.value}
                        onChange={(e) => setRole(e.target.value as typeof role)}
                        className="mt-1"
                        required
                      />
                      <div>
                        <div className="font-medium text-foreground">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Registering...' : 'Register'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/login" className="text-primary hover:underline font-medium">
                Login here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
