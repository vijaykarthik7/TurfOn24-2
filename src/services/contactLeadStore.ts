export type ContactLead = {
  id: string
  name: string
  phone: string
  email: string
  message: string
  submittedAt: string
  status: 'New' | 'Contacted' | 'Closed'
}

const KEY = 'tf24_contact_leads'

export function getContactLeads(): ContactLead[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? (arr as ContactLead[]) : []
  } catch {
    return []
  }
}

export function addContactLead(lead: ContactLead) {
  try {
    const list = getContactLeads()
    list.unshift(lead)
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {
    // storage unavailable
  }
}

export function updateContactLeadStatus(id: string, status: ContactLead['status']) {
  try {
    const list = getContactLeads()
    const updated = list.map(l => l.id === id ? { ...l, status } : l)
    localStorage.setItem(KEY, JSON.stringify(updated))
  } catch {
    // storage unavailable
  }
}
