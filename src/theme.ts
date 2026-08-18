const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '')
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}

export const c = {
  navy: '#000000',
  primary: '#0B1824',
  emerald: '#39F72A',
  emeraldLight: '#C7F42D',
  ivory: '#F5F5F5',
  white: '#F5F5F5',
  sage: '#A0A8B8',
  muted: '#A0A8B8',
  glass: '#0B1824',
  glassActive: '#101E2C',
  glassHover: '#0D1A26',
  stepActive: '#122230',
  disabled: '#040A12',
  darkText: '#000000',
}

export const alpha = (hex: string, a: number) => {
  const [r, g, b] = hexToRgb(hex)
  return `rgba(${r},${g},${b},${a})`
}
