export type ExtendedEnquiry = {
  id: string
  customer: string
  phone: string
  phoneVerified: boolean
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  players: number
  message: string
  submittedAt: string
  status: 'NEW'
}

const KEY = 'tf24_extended_enquiries'

export function getExtendedEnquiries(): ExtendedEnquiry[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? (arr as ExtendedEnquiry[]) : []
  } catch {
    return []
  }
}

export function addExtendedEnquiry(e: ExtendedEnquiry) {
  try {
    const list = getExtendedEnquiries()
    list.unshift(e)
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {
    // storage unavailable — ignore
  }
}
