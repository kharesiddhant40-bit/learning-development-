'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createInvitation, getInvitations, cancelInvitation, getCurrentUser } from '@/lib/store'

export default function InvitePage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'user' | 'support_engineer' | 'manager'>('user')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [invitations, setInvitations] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || user.role !== 'admin') {
      router.push('/login')
      return
    }
    setCurrentUser(user)
    loadInvitations()
  }, [router])

  const loadInvitations = () => {
    const invites = getInvitations()
    setInvitations(invites)
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      if (!email) {
        setError('Email is required')
        setIsLoading(false)
        return
      }

      const invitation = createInvitation(email, role, currentUser?.id || '1')
      setSuccess(`Invitation sent to ${email}`)
      setEmail('')
      setRole('user')
      loadInvitations()
    } catch (err) {
      setError('Failed to send invitation')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelInvitation = (invitationId: string) => {
    cancelInvitation(invitationId)
    loadInvitations()
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'support_engineer':
        return 'bg-blue-100 text-blue-800'
      case 'manager':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Invite Team Members</h1>
        <p className="text-slate-600 mt-2">Send invitations to join your incident management team</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Invite Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Send Invitation</CardTitle>
            <CardDescription>Invite new team members by email</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInvite} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded text-sm border border-red-200">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-50 text-green-700 rounded text-sm border border-green-200">
                  {success}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="team@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Role
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'user', label: 'User' },
                    { value: 'support_engineer', label: 'Support Engineer' },
                    { value: 'manager', label: 'Manager' },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value={option.value}
                        checked={role === option.value}
                        onChange={(e) => setRole(e.target.value as typeof role)}
                      />
                      <span className="text-sm text-slate-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Invitation'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Invitations List */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
              <CardDescription>Manage active and past invitations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {invitations.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    No invitations yet. Send one to get started!
                  </div>
                ) : (
                  invitations.map((invitation) => (
                    <div key={invitation.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">{invitation.email}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getRoleBadgeColor(invitation.role)}>
                            {invitation.role === 'support_engineer' ? 'Support Engineer' : invitation.role}
                          </Badge>
                          <Badge className={getStatusBadgeColor(invitation.status)}>
                            {invitation.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-slate-500 mt-2">
                          Sent on {formatDate(invitation.createdAt)} • Expires {formatDate(invitation.expiresAt)}
                        </div>
                      </div>
                      {invitation.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelInvitation(invitation.id)}
                          className="ml-4"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Info Box */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 mb-2">How Invitations Work</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Invitations are valid for 7 days</li>
            <li>• Users can accept invitations during registration</li>
            <li>• Cancelled invitations cannot be reopened</li>
            <li>• Each email address can only have one active invitation</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
