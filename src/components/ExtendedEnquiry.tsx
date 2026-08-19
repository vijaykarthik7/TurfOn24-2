import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ClipboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { useReveal } from '../hooks/useReveal'
import { requestOtp, verifyOtp, isPhoneVerified } from '../services/otpService'
import { addExtendedEnquiry } from '../services/enquiryStore'
import { GREEN, LIME, CHROME } from '../data/tf24'

const todayISO = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const maskPhone = (phone: string) => `+91 ${phone.replace(/(\d{5})(\d{5})/, '$1 $2')}`

type OtpPhase = 'idle' | 'sent' | 'verifying' | 'verified'

export default function ExtendedEnquiry({ verifiedPhone = '', verifiedToken = '', verifiedName = '' }: { verifiedPhone?: string; verifiedToken?: string; verifiedName?: string } = {}) {
  const ref = useReveal<HTMLDivElement>('in', 0.1)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  const [name, setName] = useState(verifiedName)
  const [phone, setPhone] = useState(verifiedPhone)
  const [otpPhase, setOtpPhase] = useState<OtpPhase>(verifiedPhone ? 'verified' : 'idle')
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', ''])
  const [otpError, setOtpError] = useState('')
  const [cooldown, setCooldown] = useState(0)
  const [token, setToken] = useState(verifiedToken)
  const verifiedRef = useRef(verifiedPhone)

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [players, setPlayers] = useState('')
  const [message, setMessage] = useState('')

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [closing, setClosing] = useState(false)

  const resetForm = useCallback(() => {
    setName('')
    setPhone('')
    setOtpPhase('idle')
    setOtp(['', '', '', '', '', ''])
    setOtpError('')
    setCooldown(0)
    setToken('')
    verifiedRef.current = ''
    setStartDate('')
    setEndDate('')
    setStartTime('')
    setEndTime('')
    setPlayers('')
    setMessage('')
    setErrors({})
    setSubmitting(false)
  }, [])

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const changePhone = (v: string) => {
    const val = v.replace(/\D/g, '').slice(0, 10)
    setPhone(val)
    if (otpPhase !== 'idle' && val !== verifiedRef.current) {
      setOtpPhase('idle')
      setOtp(['', '', '', '', '', ''])
      setToken('')
      setOtpError('')
    }
  }

  const handleSendOtp = () => {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Please enter your full name.'
    if (!/^\d{10}$/.test(phone)) errs.phone = 'Enter a valid 10-digit mobile number.'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    const res = requestOtp(phone)
    if (res.ok) {
      setOtp(['', '', '', '', '', ''])
      setOtpError('')
      setOtpPhase('sent')
      setCooldown(Math.ceil(res.cooldownMs / 1000))
      otpRefs.current[0]?.focus()
    } else {
      setOtpError(res.error)
    }
  }

  const handleOtpChange = (i: number, v: string) => {
    const digit = v.replace(/\D/g, '').slice(-1)
    const next = [...otp]
    next[i] = digit
    setOtp(next)
    if (digit && i < 5) otpRefs.current[i + 1]?.focus()
    setOtpError('')
  }

  const handleOtpKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus()
  }

  const handleOtpPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!text) return
    e.preventDefault()
    const next = [...otp]
    for (let j = 0; j < text.length; j++) next[j] = text[j]
    setOtp(next)
    otpRefs.current[Math.min(text.length, 5)]?.focus()
    setOtpError('')
  }

  const handleVerifyOtp = () => {
    const code = otp.join('')
    if (code.length !== 6) { setOtpError('Enter the 6-digit code.'); return }
    setOtpPhase('verifying')
    setTimeout(() => {
      const res = verifyOtp(phone, code)
      if (res.ok) {
        setToken(res.token)
        verifiedRef.current = phone
        setOtpPhase('verified')
        setOtpError('')
      } else {
        setOtpPhase('sent')
        setOtpError(res.error)
      }
    }, 750)
  }

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {}
    const today = todayISO()
    if (!name.trim()) e.name = 'Please enter your full name.'
    if (!/^\d{10}$/.test(phone)) e.phone = 'Enter a valid 10-digit mobile number.'
    if (otpPhase !== 'verified') e.otp = 'Verify your phone number first.'
    if (!startDate) e.startDate = 'Select a start date.'
    else if (startDate < today) e.startDate = 'Start date cannot be in the past.'
    if (!endDate) e.endDate = 'Select an end date.'
    else if (startDate && endDate < startDate) e.endDate = 'End date cannot be before start date.'
    if (!startTime) e.startTime = 'Select a start time.'
    if (!endTime) e.endTime = 'Select an end time.'
    else if (startDate === endDate && startTime && endTime && endTime <= startTime) e.endTime = 'End time must be after start time.'
    const pn = Number(players)
    if (!players.trim() || !Number.isInteger(pn) || pn <= 0) e.players = 'Enter a valid number of players.'
    return e
  }

  const handleSubmit = () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})

    if (!isPhoneVerified(phone, token)) {
      setErrors({ otp: 'Verification expired. Please verify your phone again.' })
      setOtpPhase('idle')
      setOtp(['', '', '', '', '', ''])
      setToken('')
      return
    }

    setSubmitting(true)
    setTimeout(() => {
      addExtendedEnquiry({
        id: `AR-${Math.floor(1000 + Math.random() * 9000)}`,
        customer: name.trim(),
        phone: maskPhone(phone),
        phoneVerified: true,
        startDate,
        startTime,
        endDate,
        endTime,
        players: Number(players),
        message: message.trim(),
        submittedAt: new Date().toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }),
        status: 'NEW',
      })
      setSubmitting(false)
      setSuccess(true)
    }, 900)
  }

  const closeSuccess = () => {
    setClosing(true)
    setTimeout(() => {
      setSuccess(false)
      setClosing(false)
      resetForm()
    }, 300)
  }

  const labelStyle: React.CSSProperties = { fontFamily: 'Space Grotesk', fontSize: 9, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(243,243,243,0.45)', marginBottom: 8, display: 'block' }
  const sectionTitle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#39FF14', textShadow: '0 0 14px rgba(57,255,20,0.5)', marginBottom: 20 }
  const fieldWrap: React.CSSProperties = { marginBottom: 20 }
  const errStyle: React.CSSProperties = { fontFamily: 'Space Grotesk', fontSize: 11, color: '#FF6B6B', marginTop: 6 }

  return (
    <section id="extended-enquiry" style={{ position: 'relative', zIndex: 2, background: 'rgba(11,24,36,0.55)', overflow: 'hidden', padding: '96px 0 120px' }}>
      <div className="pitch-lines" />
      <div style={{ position: 'absolute', bottom: -60, left: -30, fontFamily: 'Bebas Neue', fontSize: 300, lineHeight: 1, color: 'rgba(23,107,2,0.16)', WebkitTextStroke: '1px rgba(57,247,42,0.10)', userSelect: 'none', pointerEvents: 'none', zIndex: 0 }}>
        MORE.
      </div>

      <div className="tf24-container">
        <div ref={ref} className="reveal tf24-eq-grid">
          {/* Left — pitch / intro */}
          <div style={{ position: 'sticky', top: 110 }}>
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16, marginBottom: 18 }}>
              <span style={{ fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 600, letterSpacing: '0.45em', textTransform: 'uppercase', color: '#39FF14', textShadow: '0 0 14px rgba(57,255,20,0.5)', paddingLeft: '0.45em' }}>
                Extended Booking
              </span>
              <span style={{ width: 64, height: 2, background: '#39FF14' }} />
            </div>
            <h2 style={{ fontFamily: 'Bebas Neue', fontWeight: 400, fontSize: 'clamp(52px, 5vw, 84px)', textTransform: 'uppercase', lineHeight: 0.9, margin: '0 0 24px', color: CHROME }}>
              Need more time
              <br />
              on the <span className="tf24-grad-word" style={{ color: GREEN }}>pitch?</span>
            </h2>
            <p style={{ fontFamily: 'Space Grotesk', fontSize: 15, lineHeight: 1.7, color: 'rgba(243,243,243,0.75)', maxWidth: 430, margin: '0 0 40px' }}>
              Planning a longer session, tournament, or group game? Send us your requirements and our team will get back to you.
            </p>

            {/* Pitch visual */}
            <div style={{ position: 'relative', maxWidth: 430, height: 240, border: '1px solid rgba(57,247,42,0.28)', borderRadius: 6, background: 'repeating-linear-gradient(90deg, rgba(57,247,42,0.05) 0 1px, transparent 1px 44px)', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(57,247,42,0.25)' }} />
              <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 90, height: 90, border: '1px solid rgba(57,247,42,0.35)', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 8, height: 8, borderRadius: '50%', background: GREEN, boxShadow: '0 0 14px rgba(57,247,42,0.8)' }} />
              <div style={{ position: 'absolute', top: '50%', left: 0, width: 64, height: 120, transform: 'translateY(-50%)', border: '1px solid rgba(57,247,42,0.4)', borderLeft: 'none', borderRadius: '0 4px 4px 0' }} />
              <div style={{ position: 'absolute', top: '50%', right: 0, width: 64, height: 120, transform: 'translateY(-50%)', border: '1px solid rgba(57,247,42,0.4)', borderRight: 'none', borderRadius: '4px 0 0 4px' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 0%, rgba(57,247,42,0.12), transparent 55%)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 28, maxWidth: 430 }}>
              {[['24/7 Availability', 'Book extended windows any time'], ['Tournament Friendly', 'Multi-team, multi-day events'], ['Floodlit Nights', 'Games run late under lights']].map(([t, s]) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: GREEN, boxShadow: `0 0 10px ${GREEN}`, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontFamily: 'Bebas Neue', fontSize: 19, letterSpacing: '0.06em', color: CHROME, textTransform: 'uppercase', lineHeight: 1.1 }}>{t}</div>
                    <div style={{ fontFamily: 'Space Grotesk', fontSize: 12, color: 'rgba(243,243,243,0.45)', marginTop: 3 }}>{s}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — enquiry form */}
          <div style={{ position: 'relative', background: 'rgba(7,13,22,0.92)', border: '1px solid rgba(57,247,42,0.22)', padding: '40px 32px' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 52, height: 52, borderTop: '2px solid rgba(57,247,42,0.6)', borderLeft: '2px solid rgba(57,247,42,0.6)' }} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 52, height: 52, borderBottom: '2px solid rgba(57,247,42,0.6)', borderRight: '2px solid rgba(57,247,42,0.6)' }} />

            {/* CUSTOMER DETAILS */}
            <div style={sectionTitle}>
              <span style={{ color: LIME }}>01</span> Customer Details
            </div>
            <div style={fieldWrap}>
              <label className="tf24-eq-label" style={labelStyle}>Full Name *</label>
              <input className={'tf24-eq-input' + (errors.name ? ' invalid' : '')} placeholder="Enter your full name" value={name} onChange={e => { setName(e.target.value); if (errors.name) setErrors({ ...errors, name: '' }) }} maxLength={60} />
              {errors.name ? <div style={errStyle}>{errors.name}</div> : null}
            </div>
            <div style={fieldWrap}>
              <label className="tf24-eq-label" style={labelStyle}>Phone Number *</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '0 14px', background: 'rgba(0,0,0,0.42)', border: '1px solid rgba(243,243,243,0.16)', borderRadius: 4, fontFamily: 'Space Grotesk', fontSize: 14, color: 'rgba(243,243,243,0.6)' }}>
                  +91
                </div>
                <input
                  className={'tf24-eq-input' + (errors.phone ? ' invalid' : '')}
                  style={{ flex: 1 }}
                  placeholder="Enter mobile number"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={e => { changePhone(e.target.value); if (errors.phone) setErrors({ ...errors, phone: '' }) }}
                  onKeyDown={e => { if (e.key === 'Enter' && otpPhase === 'idle') handleSendOtp() }}
                />
              </div>
              {errors.phone ? <div style={errStyle}>{errors.phone}</div> : null}
            </div>

            {/* OTP VERIFICATION */}
            <div style={{ ...sectionTitle, marginTop: 32 }}>
              <span style={{ color: LIME }}>02</span> OTP Verification
            </div>

            {otpPhase === 'idle' && (
              <button
                className="tf24-eq-send"
                onClick={handleSendOtp}
                disabled={submitting}
              >
                Send OTP
                <span style={{ fontSize: 16 }}>→</span>
              </button>
            )}

            {otpPhase === 'sent' && (
              <div>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: GREEN, marginBottom: 6 }}>
                  OTP Sent
                </div>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: 13, color: 'rgba(243,243,243,0.6)', lineHeight: 1.6, marginBottom: 16 }}>
                  We've sent a verification code to <span style={{ color: CHROME, fontWeight: 600 }}>{maskPhone(phone)}</span>
                </div>
                <div className="tf24-otp-boxes">
                  {Array.from({ length: 6 }, (_, i) => (
                    <input
                      key={i}
                      ref={el => { otpRefs.current[i] = el }}
                      className="tf24-otp-box"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={1}
                      value={otp[i]}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      onPaste={handleOtpPaste}
                      aria-label={`OTP digit ${i + 1}`}
                    />
                  ))}
                </div>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(243,243,243,0.35)', textAlign: 'center', marginTop: 12 }}>
                  Demo OTP: 123456
                </div>
                {otpError ? <div style={{ ...errStyle, textAlign: 'center', marginTop: 10 }}>{otpError}</div> : null}
                <button className="tf24-eq-send" style={{ marginTop: 16 }} onClick={handleVerifyOtp}>
                  Verify OTP
                  <span style={{ fontSize: 16 }}>→</span>
                </button>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 14, fontFamily: 'Space Grotesk', fontSize: 11, letterSpacing: '0.08em', color: 'rgba(243,243,243,0.5)' }}>
                  {cooldown > 0 ? (
                    <span>Resend OTP in {cooldown}s</span>
                  ) : (
                    <button onClick={handleSendOtp} style={{ background: 'none', border: 'none', color: GREEN, fontFamily: 'inherit', fontSize: 'inherit', letterSpacing: 'inherit', cursor: 'pointer', textTransform: 'uppercase', padding: 0 }}>
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>
            )}

            {otpPhase === 'verifying' && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '18px 0', fontFamily: 'Space Grotesk', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: GREEN }}>
                <span className="tf24-eq-spin" />
                Verifying
              </div>
            )}

            {otpPhase === 'verified' && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', padding: '14px 16px', border: '1px solid rgba(57,247,42,0.5)', background: 'rgba(57,247,42,0.08)', borderRadius: 4, boxShadow: '0 0 22px rgba(57,247,42,0.14)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="tf24-eq-verified-ico">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <div>
                    <div style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GREEN }}>
                      Phone Verified
                    </div>
                    <div style={{ fontFamily: 'Space Grotesk', fontSize: 12, color: 'rgba(243,243,243,0.65)', marginTop: 3 }}>{maskPhone(phone)}</div>
                  </div>
                </div>
                <button onClick={() => changePhone('')} style={{ background: 'none', border: 'none', color: 'rgba(243,243,243,0.45)', fontFamily: 'Space Grotesk', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', padding: 0 }}>
                  Change
                </button>
              </div>
            )}
            {errors.otp && otpPhase !== 'verified' ? <div style={{ ...errStyle, marginTop: 10 }}>{errors.otp}</div> : null}

            {/* BOOKING REQUIREMENTS */}
            <div style={sectionTitle}>
              <span style={{ color: LIME }}>03</span> Booking Requirements
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={fieldWrap}>
                <label className="tf24-eq-label" style={labelStyle}>Start Date *</label>
                <input type="date" min={todayISO()} className={'tf24-eq-input' + (errors.startDate ? ' invalid' : '')} value={startDate} onChange={e => { setStartDate(e.target.value); if (errors.startDate) setErrors({ ...errors, startDate: '' }) }} />
                {errors.startDate ? <div style={errStyle}>{errors.startDate}</div> : null}
              </div>
              <div style={fieldWrap}>
                <label className="tf24-eq-label" style={labelStyle}>End Date *</label>
                <input type="date" min={startDate || todayISO()} className={'tf24-eq-input' + (errors.endDate ? ' invalid' : '')} value={endDate} onChange={e => { setEndDate(e.target.value); if (errors.endDate) setErrors({ ...errors, endDate: '' }) }} />
                {errors.endDate ? <div style={errStyle}>{errors.endDate}</div> : null}
              </div>
              <div style={fieldWrap}>
                <label className="tf24-eq-label" style={labelStyle}>Start Time *</label>
                <input type="time" className={'tf24-eq-input' + (errors.startTime ? ' invalid' : '')} value={startTime} onChange={e => { setStartTime(e.target.value); if (errors.startTime) setErrors({ ...errors, startTime: '' }) }} />
                {errors.startTime ? <div style={errStyle}>{errors.startTime}</div> : null}
              </div>
              <div style={fieldWrap}>
                <label className="tf24-eq-label" style={labelStyle}>End Time *</label>
                <input type="time" className={'tf24-eq-input' + (errors.endTime ? ' invalid' : '')} value={endTime} onChange={e => { setEndTime(e.target.value); if (errors.endTime) setErrors({ ...errors, endTime: '' }) }} />
                {errors.endTime ? <div style={errStyle}>{errors.endTime}</div> : null}
              </div>
            </div>
            <div style={fieldWrap}>
              <label className="tf24-eq-label" style={labelStyle}>Number of Players *</label>
              <input
                className={'tf24-eq-input' + (errors.players ? ' invalid' : '')}
                style={{ maxWidth: 220 }}
                placeholder="Enter number of players"
                inputMode="numeric"
                value={players}
                onChange={e => { setPlayers(e.target.value.replace(/\D/g, '').slice(0, 3)); if (errors.players) setErrors({ ...errors, players: '' }) }}
              />
              {errors.players ? <div style={errStyle}>{errors.players}</div> : null}
            </div>
            <div style={fieldWrap}>
              <label className="tf24-eq-label" style={labelStyle}>Enquiry Message</label>
              <textarea
                className="tf24-eq-input"
                style={{ minHeight: 120, resize: 'vertical', lineHeight: 1.6 }}
                placeholder="Tell us about your tournament, number of teams, preferred requirements, or anything else you'd like us to know."
                value={message}
                onChange={e => setMessage(e.target.value)}
                maxLength={600}
              />
            </div>

            <button className="tf24-eq-submit" disabled={otpPhase !== 'verified' || submitting} onClick={handleSubmit}>
              {submitting ? (
                <>
                  <span className="tf24-eq-spin" style={{ borderTopColor: GREEN }} />
                  Sending Enquiry
                </>
              ) : (
                <>
                  Send Enquiry <span style={{ fontSize: 16 }}>→</span>
                </>
              )}
            </button>
            <div style={{ marginTop: 14, fontFamily: 'Space Grotesk', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(243,243,243,0.35)', textAlign: 'center', lineHeight: 1.8 }}>
              {otpPhase !== 'verified' ? 'Verify your phone number to unlock submission.' : 'Your enquiry will be sent to the TURF ON 24 team.'}
            </div>
          </div>
        </div>
      </div>

      {/* Success modal — portal to body so it's never clipped by section overflow */}
      {success && createPortal(
        <div
          className={'tf24-modal-overlay' + (closing ? ' closing' : '')}
          onClick={closeSuccess}
        >
          <div className={'tf24-modal-card' + (closing ? ' closing' : '')} onClick={e => e.stopPropagation()}>
            <span className="tf24-modal-corner tf24-modal-corner-tl" />
            <span className="tf24-modal-corner tf24-modal-corner-br" />

            <div className="tf24-confirm-check">
              <svg viewBox="0 0 52 52" width="84" height="84" className="tf24-confirm-svg">
                <circle className="tf24-confirm-circle" cx="26" cy="26" r="24" />
                <path className="tf24-confirm-tick" d="M14 27l8 8 16-17" />
              </svg>
              <span className="tf24-confirm-glow" />
            </div>

            <div className="tf24-modal-item" style={{ animationDelay: '0.5s' }}>
              <div style={{ fontFamily: 'Bebas Neue', fontSize: 40, letterSpacing: '0.04em', color: GREEN, lineHeight: 1, textTransform: 'uppercase' }}>
                Thank You!
              </div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: 13, color: 'rgba(243,243,243,0.6)', margin: '12px 0 0', lineHeight: 1.7 }}>
                Your enquiry has been sent successfully.
                <br />
                Our team will reach you soon.
              </div>
            </div>

            <button className="tf24-confirm-done tf24-modal-item" style={{ marginTop: 28, animationDelay: '0.7s' }} onClick={closeSuccess}>
              Done
              <span className="arrow">→</span>
            </button>
          </div>
        </div>,
        document.body
      )}
    </section>
  )
}
