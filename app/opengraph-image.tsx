import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = '삼활인 - 인터뷰 대상자들의 이야기를 전합니다.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFFFFE',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 'bold', color: '#F49249', marginBottom: 24 }}>
          삼활인
        </div>
        <div style={{ fontSize: 36, color: '#6B7280' }}>
          인터뷰 대상자들의 이야기를 전합니다.
        </div>
      </div>
    ),
    { ...size }
  );
}
