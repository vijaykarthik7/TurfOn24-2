import { useState } from 'react'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'

const AUTH_KEY = 'tf24_admin_auth'

export default function Admin() {
  const [authed, setAuthed] = useState(() => {
    try {
      return localStorage.getItem(AUTH_KEY) === '1'
    } catch {
      return false
    }
  })

  if (!authed) {
    return <AdminLogin onLogin={() => { localStorage.setItem(AUTH_KEY, '1'); setAuthed(true) }} />
  }

  return <AdminDashboard onLogout={() => { localStorage.removeItem(AUTH_KEY); setAuthed(false) }} />
}
