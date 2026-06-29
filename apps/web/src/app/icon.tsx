import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

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
          background: '#2563eb',
          borderRadius: 6,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="5" cy="12" r="2" fill="white" />
          <circle cx="19" cy="6" r="2" fill="white" />
          <circle cx="19" cy="18" r="2" fill="white" />
          <path d="M7 12h6M13 8l4-2M13 16l4 2" stroke="white" strokeWidth="2" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
