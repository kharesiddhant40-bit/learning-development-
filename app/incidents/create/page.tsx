'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageLayout } from '@/components/page-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getCurrentUser, createIncident } from '@/lib/store'

export default function CreateIncidentPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [severity, setSeverity] = useState('medium')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const user = getCurrentUser()
    if (!user) {
      router.push('/login')
      return
    }
    setCurrentUser(user)
  }, [router])

  if (!isClient || !currentUser) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim() || !description.trim()) {
      setError('Please fill in all required fields')
      return
    }

    setIsLoading(true)

    try {
      const incident = createIncident({
        title,
        description,
        priority: priority as any,
        severity: severity as any,
        status: 'open',
        createdBy: currentUser.id,
      })

      router.push(`/incidents/${incident.id}`)
    } catch (err) {
      setError('Failed to create incident')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageLayout title="Report New Incident" subtitle="Describe the issue you're experiencing">
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Incident Details</CardTitle>
            <CardDescription>Provide as much detail as possible to help us resolve your issue quickly</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-destructive/10 text-destructive rounded text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-foreground">
                  Title <span className="text-destructive">*</span>
                </label>
                <Input
                  id="title"
                  placeholder="Brief description of the issue"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-foreground">
                  Description <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="description"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Detailed description of the issue, steps to reproduce, expected behavior, etc."
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="priority" className="text-sm font-medium text-foreground">
                    Priority
                  </label>
                  <select
                    id="priority"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="severity" className="text-sm font-medium text-foreground">
                    Severity
                  </label>
                  <select
                    id="severity"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Incident'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}
