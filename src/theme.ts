const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '')
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}

export const c = {
  navy: '#030607',
  primary: '#030607',
  emerald: '#0FA857',
  emeraldLight: '#39FF7A',
  ivory: '#F2F4F2',
  white: '#F2F4F2',
  sage: '#F2F4F2',
  muted: '#F2F4F2',
  glass: '#030607',
  glassActive: '#0FA857',
  glassHover: '#030607',
  stepActive: '#0FA857',
  disabled: '#030607',
  darkText: '#030607',
}

export const alpha = (hex: string, a: number) => {
  const [r, g, b] = hexToRgb(hex)
  return `rgba(${r},${g},${b},${a})`
}
