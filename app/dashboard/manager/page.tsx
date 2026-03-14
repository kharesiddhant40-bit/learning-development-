'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PageLayout } from '@/components/page-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getCurrentUser, getIncidents, getUsers, getAnalytics, Incident } from '@/lib/store'

export default function ManagerDashboard() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const user = getCurrentUser()
    if (!user || user.role !== 'manager') {
      router.push('/login')
      return
    }
    setCurrentUser(user)

    const analytics = getAnalytics()
    setStats(analytics)

    const allIncidents = getIncidents()
    setIncidents(allIncidents)
  }, [router])

  if (!isClient || !currentUser) return null

  const users = getUsers()
  const supportEngineers = users.filter((u) => u.role === 'support_engineer')
  const regularUsers = users.filter((u) => u.role === 'user')

  // Calculate stats by priority
  const criticalIncidents = incidents.filter((i) => i.priority === 'critical')
  const highIncidents = incidents.filter((i) => i.priority === 'high')
  const openIncidents = incidents.filter((i) => i.status === 'open')
  const inProgressIncidents = incidents.filter((i) => i.status === 'in_progress')

  // Calculate support engineer workload
  const engineerWorkload = supportEngineers.map((engineer) => ({
    engineer,
    activeIncidents: incidents.filter((i) => i.assignedTo === engineer.id && i.status !== 'closed'),
    resolvedCount: incidents.filter((i) => i.assignedTo === engineer.id && i.status === 'resolved').length,
  }))

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
    <PageLayout title="Manager Dashboard" subtitle="Analytics and team performance metrics">
      <div className="space-y-8">
        {/* Key Metrics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Incidents</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.totalIncidents}</p>
                <p className="text-xs text-muted-foreground mt-1">Active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Critical Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-red-600">{criticalIncidents.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Resolution Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {stats.totalIncidents > 0 ? Math.round((stats.resolvedIncidents / stats.totalIncidents) * 100) : 0}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">{stats.resolvedIncidents} resolved</p>
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

        {/* Incident Status Overview */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Incident Distribution</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">By Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Open</span>
                  <span className="font-semibold text-blue-600">{openIncidents.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">In Progress</span>
                  <span className="font-semibold text-yellow-600">{inProgressIncidents.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Resolved</span>
                  <span className="font-semibold text-green-600">{stats?.resolvedIncidents}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">By Priority</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Critical</span>
                  <span className="font-semibold text-red-600">{criticalIncidents.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">High</span>
                  <span className="font-semibold text-orange-600">{highIncidents.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Medium & Low</span>
                  <span className="font-semibold text-green-600">
                    {incidents.filter((i) => i.priority === 'medium' || i.priority === 'low').length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Support Team Performance */}
        <div className="space-y-4 border-t border-border pt-8">
          <h2 className="text-xl font-semibold">Support Team Performance</h2>

          {engineerWorkload.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No support engineers on team
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {engineerWorkload.map(({ engineer, activeIncidents, resolvedCount }) => (
                <Card key={engineer.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{engineer.name}</CardTitle>
                    <CardDescription>{engineer.email}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Active Incidents:</span>
                        <span className="font-semibold">{activeIncidents.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Resolved:</span>
                        <span className="font-semibold text-green-600">{resolvedCount}</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground">Top priority incidents:</p>
                      <div className="mt-2 space-y-1">
                        {activeIncidents.slice(0, 2).map((incident) => (
                          <div key={incident.id} className="text-xs p-2 bg-muted rounded">
                            <p className="line-clamp-1">{incident.title}</p>
                            <Badge className={getPriorityColor(incident.priority)} variant="outline">
                              {incident.priority}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* User Activity */}
        <div className="space-y-4 border-t border-border pt-8">
          <h2 className="text-xl font-semibold">User Base</h2>

          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold mt-2">{regularUsers.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Support Engineers</p>
                  <p className="text-2xl font-bold mt-2">{supportEngineers.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reports Submitted</p>
                  <p className="text-2xl font-bold mt-2">{incidents.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg/User</p>
                  <p className="text-2xl font-bold mt-2">
                    {regularUsers.length > 0 ? (incidents.length / regularUsers.length).toFixed(1) : 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
