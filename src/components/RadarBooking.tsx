import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { seeded, fmtHour } from '../data/tf24'

const RATE = 700
const SLOT_GROUPS = [
  { label: 'Morning', slots: [6, 7, 8, 9, 10, 11, 12] },
  { label: 'Afternoon', slots: [13, 14, 15, 16, 17, 18] },
  { label: 'Evening', slots: [19, 20, 21] },
]

const pad = (n: number) => String(n).padStart(2, '0')
const time = (h: number) => `${pad(h)}:00`

function isBooked(h: number, dateKey: string) {
  return seeded(`${dateKey}-${h}`) % 3 === 0
}

function BookingModal({ slot, onClose, onConfirm }: { slot: { hour: number; end: number; price: number } | null; onClose: () => void; onConfirm: () => void }) {
  if (!slot) return null

  const modalContent = (
    <div className="tf24-booking-modal-overlay" onClick={onClose}>
      <div className="tf24-booking-modal-card" onClick={e => e.stopPropagation()}>
        <div className="tf24-booking-modal-header">
          <span className="tf24-booking-modal-badge">CONFIRM BOOKING</span>
          <button className="tf24-booking-modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="tf24-booking-modal-body">
          <div className="tf24-booking-detail-row">
            <span className="tf24-booking-detail-label">Date</span>
            <span className="tf24-booking-detail-value">Today</span>
          </div>
          <div className="tf24-booking-detail-row">
            <span className="tf24-booking-detail-label">Time</span>
            <span className="tf24-booking-detail-value">{fmtHour(slot.hour)} - {fmtHour(slot.end)}</span>
          </div>
          <div className="tf24-booking-detail-row">
            <span className="tf24-booking-detail-label">Duration</span>
            <span className="tf24-booking-detail-value">1 Hour</span>
          </div>
          <div className="tf24-booking-detail-row tf24-booking-detail-total">
            <span className="tf24-booking-detail-label">Amount</span>
            <span className="tf24-booking-detail-value">₹{slot.price}</span>
          </div>
          <div className="tf24-booking-qr">
            <div className="tf24-booking-qr-code">
              <svg width="120" height="120" viewBox="0 0 120 120" className="tf24-qr-svg">
                <rect width="120" height="120" fill="#0B0B0B" />
                <g fill="#39F72A">
                  <rect x="10" y="10" width="8" height="8" />
                  <rect x="10" y="20" width="8" height="8" />
                  <rect x="10" y="30" width="8" height="8" />
                  <rect x="20" y="10" width="8" height="8" />
                  <rect x="30" y="10" width="8" height="8" />
                  <rect x="40" y="10" width="8" height="8" />
                  <rect x="50" y="10" width="8" height="8" />
                  <rect x="60" y="10" width="8" height="8" />
                  <rect x="70" y="10" width="8" height="8" />
                  <rect x="80" y="10" width="8" height="8" />
                  <rect x="90" y="10" width="8" height="8" />
                  <rect x="100" y="10" width="8" height="8" />
                  <rect x="10" y="100" width="8" height="8" />
                  <rect x="20" y="100" width="8" height="8" />
                  <rect x="30" y="100" width="8" height="8" />
                  <rect x="40" y="100" width="8" height="8" />
                  <rect x="50" y="100" width="8" height="8" />
                  <rect x="60" y="100" width="8" height="8" />
                  <rect x="70" y="100" width="8" height="8" />
                  <rect x="80" y="100" width="8" height="8" />
                  <rect x="90" y="100" width="8" height="8" />
                  <rect x="100" y="100" width="8" height="8" />
                  <rect x="100" y="20" width="8" height="8" />
                  <rect x="100" y="30" width="8" height="8" />
                  <rect x="100" y="40" width="8" height="8" />
                  <rect x="100" y="50" width="8" height="8" />
                  <rect x="100" y="60" width="8" height="8" />
                  <rect x="100" y="70" width="8" height="8" />
                  <rect x="100" y="80" width="8" height="8" />
                  <rect x="100" y="90" width="8" height="8" />
                  <rect x="40" y="40" width="24" height="24" />
                  <rect x="76" y="40" width="24" height="24" />
                  <rect x="40" y="76" width="24" height="24" />
                </g>
              </svg>
            </div>
            <span className="tf24-booking-qr-label">Scan to Pay</span>
          </div>
          <div className="tf24-booking-modal-actions">
            <button type="button" className="tf24-booking-btn-cancel" onClick={onClose}>Cancel</button>
            <button type="button" className="tf24-booking-btn-confirm" onClick={onConfirm}>I've Paid</button>
          </div>
        </div>
        <div className="tf24-booking-modal-footer">
          <span>Booking ID: TF24-{Math.floor(100000 + Math.random() * 900000)}</span>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

const RadarBooking = () => {
  const [dateIdx, setDateIdx] = useState(0)
  const [start, setStart] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)

  const dates = useMemo(() => {
    const out: { date: Date; day: string; num: number; label: string }[] = []
    for (let i = 0; i < 6; i++) {
      const d = new Date()
      d.setDate(d.getDate() + i)
      out.push({
        date: d,
        day: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
        num: d.getDate(),
        label: `${d.getDate()} ${d.toLocaleDateString('en-US', { month: 'short' })}`,
      })
    }
    return out
  }, [])

  const activeDateKey = dates[dateIdx].date.toLocaleDateString('en-US')

  const selectedSlot = start !== null
    ? { hour: start, end: start + 1, price: RATE }
    : null

  const getSlotState = (h: number) => {
    if (isBooked(h, activeDateKey)) return 'booked'
    if (start === h) return 'selected'
    return 'available'
  }

  const handleBookNow = () => {
    if (selectedSlot) {
      setShowModal(true)
      document.body.style.overflow = 'hidden'
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    setStart(null)
    document.body.style.overflow = ''
  }

  const handleModalConfirm = () => {
    handleModalClose()
  }

  return (
    <section id="booking" className="tf24-cinema-booking">
      <div className="tf24-cinema-shell">
        <div className="tf24-cinema-panel">
          <div className="tf24-cinema-datebar">
            {dates.map((d, i) => (
              <button
                key={d.label}
                type="button"
                className={`tf24-cinema-date ${i === dateIdx ? 'active' : ''}`}
                onClick={() => setDateIdx(i)}
              >
                <span>{d.day}</span>
                <strong>{d.num}</strong>
              </button>
            ))}
          </div>

          <div className="tf24-cinema-groups">
            {SLOT_GROUPS.map(group => (
              <div key={group.label} className="tf24-cinema-group">
                <div className="tf24-cinema-group-label">{group.label}</div>
                <div className="tf24-cinema-grid">
                  {group.slots.map(h => {
                    const state = getSlotState(h)
                    const selected = state === 'selected'

                    return (
                      <button
                        key={h}
                        type="button"
                        className={`tf24-cinema-slot ${state}`}
                        onClick={() => !isBooked(h, activeDateKey) && setStart(h)}
                        disabled={state === 'booked'}
                        aria-label={`${fmtHour(h)} ${state}`}
                      >
                        <span className="slot-time">{h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`}</span>
                        <span className="slot-state">{selected ? '✓ Locked' : state === 'booked' ? 'Booked' : 'Ready'}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="tf24-cinema-summary">
            <div className="tf24-cinema-summary-label">Selected Slot</div>
            {selectedSlot ? (
              <>
                <div className="tf24-cinema-summary-time">
                  {fmtHour(selectedSlot.hour)} - {fmtHour(selectedSlot.end)}
                </div>
                <div className="tf24-cinema-summary-price">PRICE: ₹{selectedSlot.price}</div>
                <button type="button" className="tf24-cinema-book-btn" onClick={handleBookNow}>Book Now</button>
              </>
            ) : (
              <>
                <div className="tf24-cinema-summary-time">Choose a slot</div>
                <div className="tf24-cinema-summary-price">PRICE: ₹700</div>
              </>
            )}
          </div>
        </div>
      </div>
      {showModal && selectedSlot && (
        <BookingModal slot={selectedSlot} onClose={handleModalClose} onConfirm={handleModalConfirm} />
      )}
    </section>
  )
}

export default RadarBooking