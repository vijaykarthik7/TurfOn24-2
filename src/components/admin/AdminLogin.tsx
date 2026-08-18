import { useState } from 'react'

const ACCENT = '#39F72A'

export default function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim() && password.trim()) {
      onLogin()
    } else {
      setError('Please enter both a username and password.')
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'radial-gradient(ellipse at center top, rgba(22,196,127,0.08), transparent 62%)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 420, animation: 'fade-up 0.6s cubic-bezier(.16,1,.3,1) both' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 40, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#F5F5F5', lineHeight: 1 }}>
            Turf on <span style={{ color: ACCENT }}>24</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.45)', marginTop: 10 }}>
            Admin Console
          </div>
        </div>

        <form
          onSubmit={submit}
          style={{
            background: 'rgba(11,24,36,0.6)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(22,196,127,0.3)',
            borderRadius: 18,
            padding: '34px 30px',
            boxShadow: '0 24px 50px rgba(0,0,0,0.45), 0 0 34px rgba(22,196,127,0.12)',
          }}
        >
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, marginBottom: 4 }}>
            Secure Access
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 28, textTransform: 'uppercase', color: '#F5F5F5', marginBottom: 24 }}>
            Sign in to your dashboard
          </div>

          <div style={{ marginBottom: 18 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.45)', marginBottom: 8 }}>
              Username
            </div>
            <input
              className="verify-input"
              type="text"
              value={username}
              onChange={e => { setUsername(e.target.value); setError('') }}
              placeholder="admin"
              autoFocus
            />
          </div>

          <div style={{ marginBottom: 22 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.45)', marginBottom: 8 }}>
              Password
            </div>
            <input
              className="verify-input"
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              placeholder="••••••••"
            />
          </div>

          {error ? (
            <div
              style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', color: '#FF6B6B',
                border: '1px solid rgba(255,107,107,0.35)', borderRadius: 8, padding: '10px 12px', marginBottom: 18,
                background: 'rgba(255,107,107,0.08)',
              }}
            >
              {error}
            </div>
          ) : null}

          <button type="submit" className="verify-btn" style={{ marginBottom: 20 }}>
            Sign In
          </button>

          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center',
              fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'rgba(245,245,245,0.5)', border: '1px dashed rgba(22,196,127,0.4)', borderRadius: 8, padding: '10px 12px',
            }}
          >
            <span style={{ color: ACCENT, fontSize: 11 }}>▸</span>
            Demo Login · admin / admin123
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: 22 }}>
          <a href="/" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.5)', textDecoration: 'none', transition: 'color 0.25s ease' }}
            onMouseEnter={e => { e.currentTarget.style.color = ACCENT }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(245,245,245,0.5)' }}
          >
            ← Back to website
          </a>
        </div>
      </div>
    </div>
  )
}
