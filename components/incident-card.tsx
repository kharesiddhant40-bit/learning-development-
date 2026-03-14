import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Incident } from '@/lib/store'

interface IncidentCardProps {
  incident: Incident
  showDescription?: boolean
  showReporter?: boolean
}

export function IncidentCard({ incident, showDescription = true, showReporter = false }: IncidentCardProps) {
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
    <Link href={`/incidents/${incident.id}`}>
      <Card className="hover:border-primary transition-colors cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-lg">{incident.title}</CardTitle>
              {showDescription && (
                <CardDescription className="line-clamp-2 mt-1">{incident.description}</CardDescription>
              )}
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
  )
}
