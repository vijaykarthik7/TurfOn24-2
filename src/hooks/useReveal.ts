import { useEffect, useRef } from 'react'

export function useReveal<T extends HTMLElement = HTMLDivElement>(
  className = 'in',
  threshold = 0.15
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add(className); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [className, threshold])

  return ref
}
