'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { PageLayout } from '@/components/page-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  getCurrentUser,
  getIncidentById,
  updateIncident,
  addIncidentUpdate,
  getUserById,
  Incident,
} from '@/lib/store'

export default function IncidentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [currentUser, setCurrentUser] = useState<any>(null)
  const [incident, setIncident] = useState<Incident | null>(null)
  const [newUpdate, setNewUpdate] = useState('')
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

    const inc = getIncidentById(id)
    if (!inc) {
      router.push('/incidents')
      return
    }
    setIncident(inc)
  }, [router, id])

  if (!isClient || !currentUser || !incident) return null

  const handleStatusChange = (newStatus: string) => {
    const updated = updateIncident(incident.id, { status: newStatus as any })
    if (updated) {
      setIncident(updated)
    }
  }

  const handleAddUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUpdate.trim()) return

    setIsLoading(true)
    try {
      const update = addIncidentUpdate(incident.id, newUpdate, currentUser.id)
      if (update) {
        const updatedIncident = getIncidentById(incident.id)
        if (updatedIncident) {
          setIncident(updatedIncident)
          setNewUpdate('')
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const canManage = currentUser.role === 'admin' || currentUser.role === 'support_engineer' || currentUser.id === incident.createdBy

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'closed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600 dark:text-red-400'
      case 'high':
        return 'text-orange-600 dark:text-orange-400'
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'low':
        return 'text-green-600 dark:text-green-400'
      default:
        return 'text-gray-600'
    }
  }

  const reporter = getUserById(incident.createdBy)
  const assignee = incident.assignedTo ? getUserById(incident.assignedTo) : null

  return (
    <PageLayout>
      <div className="max-w-4xl">
        <Link href="/incidents">
          <Button variant="ghost" className="mb-4">
            ← Back to Incidents
          </Button>
        </Link>

        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground">{incident.title}</h1>
                <p className="text-muted-foreground mt-2">
                  Reported by <span className="font-medium text-foreground">{reporter?.name}</span> on{' '}
                  {new Date(incident.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Badge className={getPriorityColor(incident.priority)}>
                {incident.priority}
              </Badge>
            </div>

            <p className="text-foreground text-lg">{incident.description}</p>
          </div>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <Badge className={getStatusColor(incident.status)}>
                    {incident.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Priority</p>
                  <p className="font-medium capitalize">{incident.priority}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Severity</p>
                  <p className="font-medium capitalize">{incident.severity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Assigned To</p>
                  <p className="font-medium">{assignee?.name || 'Unassigned'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Management */}
          {canManage && (
            <Card>
              <CardHeader>
                <CardTitle>Status Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['open', 'in_progress', 'resolved', 'closed'].map((status) => (
                    <Button
                      key={status}
                      variant={incident.status === status ? 'default' : 'outline'}
                      onClick={() => handleStatusChange(status)}
                      className="capitalize"
                    >
                      {status.replace('_', ' ')}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Updates */}
          <Card>
            <CardHeader>
              <CardTitle>Updates & Comments</CardTitle>
              <CardDescription>
                {incident.updates.length} update{incident.updates.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {incident.updates.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No updates yet</p>
              ) : (
                <div className="space-y-4">
                  {incident.updates.map((update) => {
                    const author = getUserById(update.author)
                    return (
                      <div key={update.id} className="border-l-2 border-primary pl-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">{author?.name}</p>
                          <span className="text-sm text-muted-foreground">
                            {new Date(update.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-foreground">{update.content}</p>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Add Update Form */}
              <form onSubmit={handleAddUpdate} className="border-t border-border pt-4 space-y-3">
                <div>
                  <label htmlFor="update" className="text-sm font-medium text-foreground">
                    Add Update
                  </label>
                  <textarea
                    id="update"
                    className="w-full mt-2 px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Share an update on this incident..."
                    rows={3}
                    value={newUpdate}
                    onChange={(e) => setNewUpdate(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={isLoading || !newUpdate.trim()}>
                  {isLoading ? 'Posting...' : 'Post Update'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
