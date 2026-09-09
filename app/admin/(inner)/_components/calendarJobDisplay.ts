export const SIZE_SHORT: Record<string, string> = {
  studio: 'Studio', '1br': '1BR', '2br': '2BR', '3br': '3BR', '4br+': '4BR+',
}

export const TYPE_STYLE = {
  moving: { bg: '#D6E8D3', color: '#254220', icon: '🚛' },
  junk_removal: { bg: '#FDE4C8', color: '#9A4B12', icon: '🗑️' },
} as const

export function formatTime(time: string | null): string {
  if (!time) return 'No time set'
  const [hStr, mStr] = time.split(':')
  const h = parseInt(hStr, 10)
  const m = mStr
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${m} ${period}`
}
