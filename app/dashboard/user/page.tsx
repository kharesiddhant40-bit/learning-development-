'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PageLayout } from '@/components/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getCurrentUser, getIncidents, createIncident, Incident } from '@/lib/store'

export default function UserDashboard() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const user = getCurrentUser()
    if (!user || user.role !== 'user') {
      router.push('/login')
      return
    }
    setCurrentUser(user)

    const allIncidents = getIncidents().filter((i) => i.createdBy === user.id)
    setIncidents(allIncidents)
  }, [router])

  if (!isClient || !currentUser) return null

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
    <PageLayout title="My Incidents" subtitle="View and manage incidents you've reported">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">My Reports ({incidents.length})</h2>
          <Link href="/incidents/create">
            <Button>Report New Incident</Button>
          </Link>
        </div>

        {incidents.length === 0 ? (
          <Card>
            <CardContent className="pt-10 text-center">
              <p className="text-muted-foreground mb-4">You haven&apos;t reported any incidents yet.</p>
              <Link href="/incidents/create">
                <Button>Create First Report</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {incidents.map((incident) => (
              <Link key={incident.id} href={`/incidents/${incident.id}`}>
                <Card className="hover:border-primary transition-colors cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{incident.title}</CardTitle>
                        <CardDescription className="line-clamp-2 mt-1">
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
    </PageLayout>
  )
}
