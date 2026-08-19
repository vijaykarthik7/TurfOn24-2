import { useState } from 'react'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'

const AUTH_KEY = 'tf24_admin_auth'

export default function Admin() {
  const [authed, setAuthed] = useState(false)

  if (!authed) {
    return <AdminLogin onLogin={() => setAuthed(true)} />
  }

  return <AdminDashboard onLogout={() => setAuthed(false)} />
}
