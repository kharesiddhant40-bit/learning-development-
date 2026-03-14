'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PageLayout } from '@/components/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getCurrentUser, getIncidents, Incident } from '@/lib/store'

export default function IncidentsPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const user = getCurrentUser()
    if (!user) {
      router.push('/login')
      return
    }
    setCurrentUser(user)

    const allIncidents = getIncidents()
    setIncidents(allIncidents)
  }, [router])

  if (!isClient || !currentUser) return null

  const filteredIncidents = incidents.filter((incident) => {
    const statusMatch = filterStatus === 'all' || incident.status === filterStatus
    const priorityMatch = filterPriority === 'all' || incident.priority === filterPriority
    return statusMatch && priorityMatch
  })

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
    <PageLayout title="All Incidents" subtitle="Browse and manage all reported incidents">
      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground">Filter by Status</label>
                <select
                  className="w-full mt-2 px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium text-foreground">Filter by Priority</label>
                <select
                  className="w-full mt-2 px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                >
                  <option value="all">All Priorities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <Link href="/incidents/create">
                <Button>Report Incident</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Incidents List */}
        <div className="space-y-4">
          {filteredIncidents.length === 0 ? (
            <Card>
              <CardContent className="pt-10 text-center">
                <p className="text-muted-foreground mb-4">No incidents found</p>
                <Link href="/incidents/create">
                  <Button>Report First Incident</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredIncidents.map((incident) => (
                <Link key={incident.id} href={`/incidents/${incident.id}`}>
                  <Card className="hover:border-primary transition-colors cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{incident.title}</CardTitle>
                          <CardDescription className="line-clamp-1 mt-1">
                            {incident.description}
                          </CardDescription>
                        </div>
                        <Badge className={getPriorityColor(incident.priority)}>
                          {incident.priority}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 flex-wrap">
                        <Badge className={getStatusColor(incident.status)}>
                          {incident.status.replace('_', ' ')}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(incident.createdAt).toLocaleDateString()}
                        </span>
                        {incident.updates.length > 0 && (
                          <span className="text-sm text-muted-foreground">
                            {incident.updates.length} update{incident.updates.length !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
