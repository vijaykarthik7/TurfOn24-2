// Simulated OTP backend service for TURFON24.
//
// This module emulates a server-side OTP flow: the OTP is generated here,
// held in module-scoped memory (never React state, never localStorage, never
// returned to the UI), expires after 5 minutes, enforces a 30s resend
// cooldown, a rate limit, and a max attempt count. A verification token is
// issued on success and validated when the enquiry is submitted.
//
// PRODUCTION: replace this with a call to your backend (e.g. POST /otp/send,
// POST /otp/verify) backed by a real SMS provider and server-side storage.
// Do not generate or verify OTPs on the client in production.

const OTP_LIFETIME_MS = 5 * 60 * 1000
const RESEND_COOLDOWN_MS = 30 * 1000
const MAX_ATTEMPTS = 5
const MAX_REQUESTS_PER_WINDOW = 3
const REQUEST_WINDOW_MS = 10 * 60 * 1000

type Pending = {
  phone: string
  otp: string
  expiresAt: number
  attempts: number
  cooldownUntil: number
  windowStart: number
  requests: number
}

type Verified = {
  phone: string
  token: string
  expiresAt: number
}

const pending = new Map<string, Pending>()
const verified = new Map<string, Verified>()

const digits = (phone: string) => phone.replace(/\D/g, '')

export type OtpRequestResult = { ok: true; cooldownMs: number } | { ok: false; error: string }

export function requestOtp(phone: string): OtpRequestResult {
  const num = digits(phone)
  if (num.length !== 10) return { ok: false, error: 'Enter a valid 10-digit mobile number.' }

  const now = Date.now()
  const existing = pending.get(num)

  if (existing && existing.cooldownUntil > now) {
    const s = Math.ceil((existing.cooldownUntil - now) / 1000)
    return { ok: false, error: `Too many requests. Try again in ${s}s.` }
  }
  if (existing && now - existing.windowStart < REQUEST_WINDOW_MS && existing.requests >= MAX_REQUESTS_PER_WINDOW) {
    return { ok: false, error: 'Too many OTP requests. Please try again later.' }
  }

  // Demo build: OTP is always 123456 so the flow can be tested end-to-end.
  const otp = '123456'
  pending.set(num, {
    phone: num,
    otp,
    expiresAt: now + OTP_LIFETIME_MS,
    attempts: 0,
    cooldownUntil: now + RESEND_COOLDOWN_MS,
    windowStart: existing && now - existing.windowStart < REQUEST_WINDOW_MS ? existing.windowStart : now,
    requests: existing && now - existing.windowStart < REQUEST_WINDOW_MS ? existing.requests + 1 : 1,
  })

  // Simulated SMS delivery. In production this is sent by your backend/SMS provider.
  console.info(`[TURFON24] Simulated SMS to +91${num}: your OTP is ${otp}. Valid for 5 minutes.`)

  return { ok: true, cooldownMs: RESEND_COOLDOWN_MS }
}

export type OtpVerifyResult = { ok: true; token: string } | { ok: false; error: string }

export function verifyOtp(phone: string, code: string): OtpVerifyResult {
  const num = digits(phone)
  const now = Date.now()
  const p = pending.get(num)

  if (!p) return { ok: false, error: 'No OTP requested for this number. Request a new code.' }
  if (now > p.expiresAt) {
    pending.delete(num)
    return { ok: false, error: 'OTP expired. Request a new code.' }
  }
  if (p.attempts >= MAX_ATTEMPTS) {
    pending.delete(num)
    return { ok: false, error: 'Too many attempts. Request a new code.' }
  }
  if (p.otp === code.trim()) {
    pending.delete(num)
    const token = Array.from(crypto.getRandomValues(new Uint32Array(4)))
      .map(v => v.toString(16).padStart(8, '0'))
      .join('')
    verified.set(num, { phone: num, token, expiresAt: now + OTP_LIFETIME_MS })
    return { ok: true, token }
  }

  p.attempts += 1
  return { ok: false, error: 'Invalid OTP. Please try again.' }
}

export function isPhoneVerified(phone: string, token: string): boolean {
  const num = digits(phone)
  const v = verified.get(num)
  if (!v || v.token !== token) return false
  if (Date.now() > v.expiresAt) {
    verified.delete(num)
    return false
  }
  return true
}
