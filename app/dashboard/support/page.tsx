'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PageLayout } from '@/components/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getCurrentUser, getIncidents, Incident, updateIncident, getUserById } from '@/lib/store'

export default function SupportDashboard() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [assignedIncidents, setAssignedIncidents] = useState<Incident[]>([])
  const [availableIncidents, setAvailableIncidents] = useState<Incident[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const user = getCurrentUser()
    if (!user || user.role !== 'support_engineer') {
      router.push('/login')
      return
    }
    setCurrentUser(user)

    const allIncidents = getIncidents()
    const assigned = allIncidents.filter((i) => i.assignedTo === user.id && i.status !== 'closed')
    const available = allIncidents.filter((i) => !i.assignedTo && i.status === 'open')
    
    setAssignedIncidents(assigned.sort((a, b) => b.priority.localeCompare(a.priority)))
    setAvailableIncidents(available)
  }, [router])

  if (!isClient || !currentUser) return null

  const handleAssign = (incidentId: string) => {
    const updated = updateIncident(incidentId, { assignedTo: currentUser.id })
    if (updated) {
      const allIncidents = getIncidents()
      const assigned = allIncidents.filter((i) => i.assignedTo === currentUser.id && i.status !== 'closed')
      const available = allIncidents.filter((i) => !i.assignedTo && i.status === 'open')
      setAssignedIncidents(assigned)
      setAvailableIncidents(available)
    }
  }

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
    <PageLayout title="Support Dashboard" subtitle="Manage assigned incidents and handle new requests">
      <div className="space-y-8">
        {/* Assigned Incidents */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">My Assigned Incidents ({assignedIncidents.length})</h2>
            <p className="text-sm text-muted-foreground">Incidents assigned to you</p>
          </div>

          {assignedIncidents.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No incidents assigned yet
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {assignedIncidents.map((incident) => (
                <Link key={incident.id} href={`/incidents/${incident.id}`}>
                  <Card className="hover:border-primary transition-colors cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-base">{incident.title}</CardTitle>
                          <CardDescription className="text-sm mt-1">
                            Reported by {getUserById(incident.createdBy)?.name}
                          </CardDescription>
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
          )}
        </div>

        {/* Available Incidents */}
        {availableIncidents.length > 0 && (
          <div className="space-y-4 border-t border-border pt-8">
            <div>
              <h2 className="text-xl font-semibold mb-2">Available Incidents ({availableIncidents.length})</h2>
              <p className="text-sm text-muted-foreground">Unassigned incidents waiting for support</p>
            </div>

            <div className="space-y-3">
              {availableIncidents.map((incident) => (
                <Card key={incident.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-base">{incident.title}</CardTitle>
                        <CardDescription className="text-sm mt-1">
                          {incident.description}
                        </CardDescription>
                      </div>
                      <Badge className={getPriorityColor(incident.priority)}>
                        {incident.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(incident.status)}>
                          {incident.status.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(incident.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          handleAssign(incident.id)
                        }}
                      >
                        Assign to Me
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
