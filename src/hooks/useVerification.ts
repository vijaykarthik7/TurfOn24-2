import { useRef, useState, type ClipboardEvent } from 'react'

export type VerificationStep = 'form' | 'otp'

export function useVerification() {
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  const [verified, setVerified] = useState(false)
  const [step, setStep] = useState<VerificationStep>('form')
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', ''])
  const [error, setError] = useState('')

  const handleSendOtp = () => {
    const digits = mobile.replace(/\D/g, '')
    if (!name.trim()) {
      setError('Please enter your full name.')
      return
    }
    if (digits.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.')
      return
    }
    setError('')
    setOtp(['', '', '', '', '', ''])
    setStep('otp')
  }

  const verifyCode = (val: string) => {
    if (val === '123456') {
      setVerified(true)
      setError('')
    } else {
      setError('Incorrect OTP. Try 123456.')
    }
  }

  const handleOtpChange = (i: number, v: string) => {
    const digit = v.replace(/\D/g, '').slice(-1)
    const next = [...otp]
    next[i] = digit
    setOtp(next)
    if (digit && i < 5) otpRefs.current[i + 1]?.focus()
    const val = next.join('')
    if (val.length === 6) {
      verifyCode(val)
    } else {
      setError('')
    }
  }

  const handleOtpPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!text) return
    e.preventDefault()
    const next = [...otp]
    for (let j = 0; j < text.length; j++) next[j] = text[j]
    setOtp(next)
    const val = next.join('')
    if (val.length === 6) {
      verifyCode(val)
    } else {
      otpRefs.current[Math.min(text.length, 5)]?.focus()
      setError('')
    }
  }

  const handleVerifyOtp = () => {
    const val = otp.join('')
    if (val.length !== 6) {
      setError('Enter the 6-digit code to continue.')
      return
    }
    verifyCode(val)
  }

  const editNumber = () => {
    setStep('form')
    setError('')
  }

  return {
    verified,
    step,
    name,
    mobile,
    otp,
    error,
    otpRefs,
    setName,
    setMobile,
    handleSendOtp,
    handleOtpChange,
    handleOtpPaste,
    handleVerifyOtp,
    editNumber,
  }
}

export type VerificationState = ReturnType<typeof useVerification>
