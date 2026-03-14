'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { loginUser, getCurrentUser } from '@/lib/store'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      router.push('/dashboard/user')
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const user = loginUser(email, password)
      if (user) {
        router.push(`/dashboard/${user.role === 'support_engineer' ? 'support' : user.role}`)
      } else {
        setError('Invalid email or password')
      }
    } catch (err) {
      setError('An error occurred during login')
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
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 bg-destructive/10 text-destructive rounded text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
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

              <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded text-sm text-blue-900 dark:text-blue-200">
                <p className="font-semibold mb-2">Demo Credentials:</p>
                <ul className="space-y-1 text-xs">
                  <li><strong>Admin:</strong> admin@example.com</li>
                  <li><strong>Support:</strong> support@example.com</li>
                  <li><strong>Manager:</strong> manager@example.com</li>
                  <li><strong>User:</strong> user@example.com</li>
                </ul>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Don&apos;t have an account? </span>
              <Link href="/register" className="text-primary hover:underline font-medium">
                Register here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
