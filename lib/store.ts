// Mock database store using localStorage
export interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'support_engineer' | 'admin' | 'manager'
  createdAt: string
}

export interface Incident {
  id: string
  title: string
  description: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  severity: 'low' | 'medium' | 'high' | 'critical'
  assignedTo?: string
  createdBy: string
  createdAt: string
  updatedAt: string
  updates: IncidentUpdate[]
}

export interface IncidentUpdate {
  id: string
  incidentId: string
  content: string
  author: string
  createdAt: string
}

export interface Analytics {
  totalIncidents: number
  resolvedIncidents: number
  avgResolutionTime: number
  criticalIncidents: number
}

export interface Invitation {
  id: string
  email: string
  role: 'user' | 'support_engineer' | 'manager'
  status: 'pending' | 'accepted' | 'cancelled'
  invitedBy: string
  createdAt: string
  expiresAt: string
}

const STORAGE_KEY = 'incident_management_db'

const defaultUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'support@example.com',
    name: 'Support Engineer',
    role: 'support_engineer',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'manager@example.com',
    name: 'Manager User',
    role: 'manager',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    email: 'user@example.com',
    name: 'Regular User',
    role: 'user',
    createdAt: new Date().toISOString(),
  },
]

const defaultIncidents: Incident[] = [
  {
    id: '1',
    title: 'Database Connection Failed',
    description: 'Unable to connect to production database',
    status: 'in_progress',
    priority: 'critical',
    severity: 'critical',
    assignedTo: '2',
    createdBy: '4',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updates: [
      {
        id: 'u1',
        incidentId: '1',
        content: 'Started investigating the connection pool',
        author: '2',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: '2',
    title: 'API Response Timeout',
    description: 'API endpoints timing out under load',
    status: 'open',
    priority: 'high',
    severity: 'high',
    createdBy: '4',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updates: [],
  },
  {
    id: '3',
    title: 'UI Bug: Login Button Not Responding',
    description: 'Login button on homepage not clickable',
    status: 'resolved',
    priority: 'medium',
    severity: 'low',
    assignedTo: '2',
    createdBy: '4',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updates: [
      {
        id: 'u2',
        incidentId: '3',
        content: 'Fixed CSS z-index issue',
        author: '2',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
]

interface DB {
  users: User[]
  incidents: Incident[]
  invitations: Invitation[]
  currentUser: User | null
}

export function initializeStore(): DB {
  if (typeof window === 'undefined') {
    return { users: defaultUsers, incidents: defaultIncidents, invitations: [], currentUser: null }
  }

  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    return JSON.parse(stored)
  }

  const db: DB = {
    users: defaultUsers,
    incidents: defaultIncidents,
    invitations: [],
    currentUser: null,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
  return db
}

export function getStore(): DB {
  if (typeof window === 'undefined') {
    return { users: defaultUsers, incidents: defaultIncidents, invitations: [], currentUser: null }
  }
  return initializeStore()
}

export function saveStore(db: DB): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
  }
}

export function getCurrentUser(): User | null {
  const db = getStore()
  return db.currentUser
}

export function setCurrentUser(user: User | null): void {
  const db = getStore()
  db.currentUser = user
  saveStore(db)
}

export function loginUser(email: string, password: string): User | null {
  const db = getStore()
  const user = db.users.find((u) => u.email === email)
  if (user) {
    setCurrentUser(user)
    return user
  }
  return null
}

export function logoutUser(): void {
  setCurrentUser(null)
}

export function registerUser(email: string, name: string, role: string = 'user'): User | null {
  const db = getStore()
  if (db.users.some((u) => u.email === email)) {
    return null
  }

  const newUser: User = {
    id: String(db.users.length + 1),
    email,
    name,
    role: role as any,
    createdAt: new Date().toISOString(),
  }
  db.users.push(newUser)
  saveStore(db)
  setCurrentUser(newUser)
  return newUser
}

export function createIncident(incident: Omit<Incident, 'id' | 'createdAt' | 'updatedAt' | 'updates'>): Incident {
  const db = getStore()
  const newIncident: Incident = {
    ...incident,
    id: String(Date.now()),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    updates: [],
  }
  db.incidents.push(newIncident)
  saveStore(db)
  return newIncident
}

export function getIncidents(): Incident[] {
  return getStore().incidents
}

export function getIncidentById(id: string): Incident | undefined {
  return getStore().incidents.find((i) => i.id === id)
}

export function updateIncident(id: string, updates: Partial<Incident>): Incident | undefined {
  const db = getStore()
  const incident = db.incidents.find((i) => i.id === id)
  if (incident) {
    Object.assign(incident, updates, { updatedAt: new Date().toISOString() })
    saveStore(db)
  }
  return incident
}

export function addIncidentUpdate(incidentId: string, content: string, author: string): IncidentUpdate | null {
  const db = getStore()
  const incident = db.incidents.find((i) => i.id === incidentId)
  if (!incident) return null

  const update: IncidentUpdate = {
    id: String(Date.now()),
    incidentId,
    content,
    author,
    createdAt: new Date().toISOString(),
  }
  incident.updates.push(update)
  incident.updatedAt = new Date().toISOString()
  saveStore(db)
  return update
}

export function getAnalytics(): Analytics {
  const incidents = getIncidents()
  const resolved = incidents.filter((i) => i.status === 'resolved').length
  const critical = incidents.filter((i) => i.severity === 'critical').length

  return {
    totalIncidents: incidents.length,
    resolvedIncidents: resolved,
    avgResolutionTime: 4.5,
    criticalIncidents: critical,
  }
}

export function getUsers(): User[] {
  return getStore().users
}

export function getUserById(id: string): User | undefined {
  return getStore().users.find((u) => u.id === id)
}

export function createInvitation(email: string, role: 'user' | 'support_engineer' | 'manager', invitedBy: string): Invitation {
  const db = getStore()
  const newInvitation: Invitation = {
    id: String(Date.now()),
    email,
    role,
    status: 'pending',
    invitedBy,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  }
  db.invitations.push(newInvitation)
  saveStore(db)
  return newInvitation
}

export function getInvitations(): Invitation[] {
  return getStore().invitations
}

export function getInvitationById(id: string): Invitation | undefined {
  return getStore().invitations.find((i) => i.id === id)
}

export function getPendingInvitations(): Invitation[] {
  return getStore().invitations.filter((i) => i.status === 'pending')
}

export function acceptInvitation(invitationId: string, name: string): User | null {
  const db = getStore()
  const invitation = db.invitations.find((i) => i.id === invitationId)
  if (!invitation || invitation.status !== 'pending') {
    return null
  }

  if (db.users.some((u) => u.email === invitation.email)) {
    return null
  }

  const newUser: User = {
    id: String(db.users.length + 1),
    email: invitation.email,
    name,
    role: invitation.role,
    createdAt: new Date().toISOString(),
  }
  db.users.push(newUser)
  invitation.status = 'accepted'
  saveStore(db)
  setCurrentUser(newUser)
  return newUser
}

export function cancelInvitation(invitationId: string): boolean {
  const db = getStore()
  const invitation = db.invitations.find((i) => i.id === invitationId)
  if (!invitation) {
    return false
  }
  invitation.status = 'cancelled'
  saveStore(db)
  return true
}
