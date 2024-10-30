import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Image generation
export default async function Icon() {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 24,
            background: 'black',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          A
        </div>
      ),
      {
        ...size
      }
    )
  } catch (error) {
    console.error('Error generating icon:', error);
    // Return a fallback image response
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 24,
            background: 'black',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          A
        </div>
      ),
      {
        ...size
      }
    )
  }
} 