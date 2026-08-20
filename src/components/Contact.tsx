import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import { CHROME, GREEN } from '../data/tf24'
import { addContactLead } from '../services/contactLeadStore'

export default function Contact() {
  const ref = useReveal<HTMLDivElement>('in', 0.1)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) return
    addContactLead({
      id: `CL-${Date.now()}`,
      name: name.trim(),
      phone: `+91 ${phone.trim()}`,
      email: email.trim(),
      message: message.trim(),
      submittedAt: new Date().toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }),
      status: 'New',
    })
    setSubmitted(true)
    setTimeout(() => {
      setName('')
      setEmail('')
      setPhone('')
      setMessage('')
      setSubmitted(false)
    }, 3000)
  }

  const labelStyle: React.CSSProperties = { fontFamily: 'Space Grotesk', fontSize: 9, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(243,243,243,0.45)', marginBottom: 8, display: 'block' }
  const inputStyle: React.CSSProperties = { width: '100%', boxSizing: 'border-box' as const, background: 'rgba(0,0,0,0.42)', border: '1px solid rgba(57,255,122,0.25)', color: '#F2F4F2', padding: 16, fontFamily: 'Space Grotesk', fontSize: 14, outline: 'none', borderRadius: 4, transition: 'border-color 0.2s ease, box-shadow 0.2s ease' }

  return (
    <section id="contact" style={{ position: 'relative', zIndex: 2, background: 'rgba(11,24,36,0.55)', overflow: 'hidden', padding: '120px 0' }}>
      <div className="pitch-lines" />
      <div style={{ position: 'absolute', top: -30, left: -24, fontFamily: 'Bebas Neue', fontSize: 260, lineHeight: 1, color: 'rgba(23,107,2,0.16)', WebkitTextStroke: '1px rgba(57,255,122,0.10)', userSelect: 'none', pointerEvents: 'none', zIndex: 0 }}>
        TOUCH.
      </div>

      <div className="tf24-container">
        <div ref={ref} className="reveal tf24-contact-layout" style={{ display: 'grid', gridTemplateColumns: '0.55fr 1fr', gap: 48, alignItems: 'start' }}>
          {/* Left — info */}
          <div>
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16, marginBottom: 18 }}>
              <span style={{ fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 600, letterSpacing: '0.45em', textTransform: 'uppercase', color: '#39FF7A', textShadow: '0 0 14px rgba(57,255,122,0.5)', paddingLeft: '0.45em' }}>
                Contact
              </span>
              <span style={{ width: 64, height: 2, background: '#39FF7A' }} />
            </div>
            <h2 style={{ fontFamily: 'Bebas Neue', fontWeight: 400, fontSize: 'clamp(48px, 6vw, 96px)', textTransform: 'uppercase', lineHeight: 0.9, margin: '0 0 24px', color: CHROME }}>
              Get in
              <br />
              <span className="tf24-grad-word" style={{ color: '#39FF7A' }}>touch.</span>
            </h2>
            <p style={{ fontFamily: 'Space Grotesk', fontSize: 15, lineHeight: 1.7, color: 'rgba(243,243,243,0.75)', maxWidth: 400, margin: '0 0 40px' }}>
              Have a question about turf bookings, pricing, or availability? Fill out the form and we'll get back to you shortly.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { icon: '📍', label: 'Location', value: 'Periya Kanganankuppam, (Behind KUN HYNDAI/TRUE VALUE Show Room), Cuddalore - 607002' },
                { icon: '📞', label: 'Phone', value: '89399 89366' },
                { icon: '✉', label: 'Email', value: 'hello@turfon24.com' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(57,255,122,0.35)', borderRadius: '50%', fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#39FF7A', marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontFamily: 'Space Grotesk', fontSize: 14, color: 'rgba(243,243,243,0.8)' }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div style={{ position: 'relative', background: 'rgba(7,13,22,0.92)', border: '1px solid rgba(57,255,122,0.22)', borderRadius: 6, padding: '36px 32px' }}>
            <span className="tf24-bflow-corner tf24-bflow-corner-tl" />
            <span className="tf24-bflow-corner tf24-bflow-corner-br" />

            {submitted ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 0', gap: 16 }}>
                <div style={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '2px solid rgba(57,255,122,0.5)', background: 'rgba(57,255,122,0.08)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
                </div>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: 13, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GREEN }}>
                  Enquiry Sent!
                </div>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: 13, color: 'rgba(243,243,243,0.6)', textAlign: 'center' }}>
                  We'll get back to you within 24 hours.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input
                    style={inputStyle}
                    placeholder="Enter your full name"
                    value={name}
                    maxLength={60}
                    required
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <input
                    style={inputStyle}
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    maxLength={80}
                    required
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Phone Number *</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <div style={{ padding: '0 14px', background: 'rgba(0,0,0,0.42)', border: '1px solid rgba(57,255,122,0.25)', borderRadius: 4, fontFamily: 'Space Grotesk', fontSize: 14, color: 'rgba(243,243,243,0.6)', display: 'flex', alignItems: 'center' }}>+91</div>
                    <input
                      style={{ ...inputStyle, flex: 1 }}
                      placeholder="Enter mobile number"
                      inputMode="numeric"
                      maxLength={10}
                      value={phone}
                      required
                      onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Your Enquiry *</label>
                  <textarea
                    style={{ ...inputStyle, minHeight: 120, resize: 'vertical' as const }}
                    placeholder="Tell us what you need help with..."
                    value={message}
                    maxLength={500}
                    required
                    onChange={e => setMessage(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="tf24-eq-send"
                  style={{ marginTop: 4 }}
                >
                  Send Enquiry
                  <span style={{ fontSize: 16 }}>→</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
