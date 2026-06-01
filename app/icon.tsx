import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#4D6B47',
          borderRadius: '7px',
        }}
      >
        <span style={{ color: '#FAF7F2', fontSize: '14px', fontWeight: 800, letterSpacing: '-0.5px' }}>
          SG
        </span>
      </div>
    ),
    { ...size }
  )
}
