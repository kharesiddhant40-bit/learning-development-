'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PageLayout } from '@/components/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getCurrentUser, getUsers, getIncidents, User } from '@/lib/store'

export default function AdminUsersPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [users, setUsers] = useState<User[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const user = getCurrentUser()
    if (!user || user.role !== 'admin') {
      router.push('/login')
      return
    }
    setCurrentUser(user)

    const allUsers = getUsers()
    setUsers(allUsers)
  }, [router])

  if (!isClient || !currentUser) return null

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'support_engineer':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'manager':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'user':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <PageLayout title="User Management" subtitle="Manage system users and their roles">
      <div className="space-y-6">
        <Link href="/dashboard/admin">
          <Button variant="ghost">← Back to Dashboard</Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>Total users: {users.length}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => {
                const userIncidents = getIncidents().filter((i) => i.createdBy === user.id)
                const assignedIncidents = getIncidents().filter((i) => i.assignedTo === user.id)

                return (
                  <div key={user.id} className="flex items-start justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">{user.name}</h3>
                        <Badge className={getRoleColor(user.role)}>{user.role.replace('_', ' ')}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </p>

                      {user.role === 'user' && userIncidents.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {userIncidents.length} incident{userIncidents.length !== 1 ? 's' : ''} reported
                        </p>
                      )}

                      {user.role === 'support_engineer' && assignedIncidents.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {assignedIncidents.length} incident{assignedIncidents.length !== 1 ? 's' : ''} assigned
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm" disabled>
                        Edit
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Role Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Role Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(['admin', 'support_engineer', 'manager', 'user'] as const).map((role) => {
                const count = users.filter((u) => u.role === role).length
                return (
                  <div key={role} className="p-4 border border-border rounded-lg text-center">
                    <p className="text-2xl font-bold mb-1">{count}</p>
                    <p className="text-xs text-muted-foreground capitalize">{role.replace('_', ' ')}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}
