'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PageLayout } from '@/components/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getCurrentUser, getIncidents, getUsers, getAnalytics, Incident } from '@/lib/store'

export default function AdminDashboard() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const user = getCurrentUser()
    if (!user || user.role !== 'admin') {
      router.push('/login')
      return
    }
    setCurrentUser(user)

    const analytics = getAnalytics()
    setStats(analytics)

    const allIncidents = getIncidents()
    setIncidents(allIncidents.slice(0, 10))
  }, [router])

  if (!isClient || !currentUser) return null

  const users = getUsers()
  const supportEngineers = users.filter((u) => u.role === 'support_engineer')

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

  return (
    <PageLayout title="Admin Dashboard" subtitle="System administration and incident overview">
      <div className="space-y-8">
        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Incidents</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.totalIncidents}</p>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">{stats.resolvedIncidents}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.totalIncidents > 0 ? Math.round((stats.resolvedIncidents / stats.totalIncidents) * 100) : 0}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Critical Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-red-600">{stats.criticalIncidents}</p>
                <p className="text-xs text-muted-foreground mt-1">Active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg Resolution</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.avgResolutionTime}h</p>
                <p className="text-xs text-muted-foreground mt-1">Hours</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Management */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Team Members</h2>
              <p className="text-sm text-muted-foreground mt-1">Manage users and roles</p>
            </div>
            <div className="flex gap-2">
              <Link href="/dashboard/admin/invite">
                <Button className="bg-blue-600 hover:bg-blue-700">Invite Members</Button>
              </Link>
              <Link href="/dashboard/admin/users">
                <Button variant="outline">Manage Users</Button>
              </Link>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border border-border rounded">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <Badge variant="outline">{user.role.replace('_', ' ')}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support Engineers Status */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Support Team Status</h2>

          {supportEngineers.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No support engineers assigned yet
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {supportEngineers.map((engineer) => {
                const assignedCount = getIncidents().filter(
                  (i) => i.assignedTo === engineer.id && i.status !== 'closed'
                ).length
                return (
                  <Card key={engineer.id}>
                    <CardHeader>
                      <CardTitle className="text-base">{engineer.name}</CardTitle>
                      <CardDescription>{engineer.email}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm">
                        <p className="text-muted-foreground">
                          <span className="font-semibold text-foreground">{assignedCount}</span> active incidents
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent Incidents */}
        <div className="space-y-4 border-t border-border pt-8">
          <h2 className="text-xl font-semibold">Recent Incidents</h2>

          <div className="space-y-3">
            {incidents.map((incident) => (
              <Link key={incident.id} href={`/incidents/${incident.id}`}>
                <Card className="hover:border-primary transition-colors cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-base">{incident.title}</CardTitle>
                      </div>
                      <Badge className={getPriorityColor(incident.priority)}>
                        {incident.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge className={getStatusColor(incident.status)}>
                        {incident.status.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(incident.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
