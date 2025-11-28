'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Container, Section } from '@/components/layout';
import { formatCurrency } from '@/lib/utils';

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || '후원자';
  const amount = searchParams.get('amount') || '0';
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shareText = '저는 삼활인의 어르신 이야기 기록 프로젝트에 후원했어요. 함께 해주세요! 💛';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('링크 복사에 실패했습니다.');
    }
  };

  const handleInstaShare = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      alert('링크가 복사되었습니다!\n인스타그램 스토리에 붙여넣기 해주세요.');
      window.open('https://instagram.com', '_blank');
    } catch (err) {
      alert('링크 복사에 실패했습니다.');
    }
  };

  return (
    <Section spacing="lg">
      <Container size="sm">
        <div className="text-center">
          {/* 아이콘 */}
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🎉</span>
          </div>

          {/* 제목 */}
          <h1 className="text-display text-gray-900 mb-4">
            감사합니다!
          </h1>

          {/* 메시지 */}
          <p className="text-body-lg text-gray-600 mb-8">
            <strong>{name}</strong>님 덕분에<br />
            어르신들의 이야기가<br />
            더 많은 분들께 전해질 수 있어요.
          </p>

          {/* 안내 박스 */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <p className="text-body text-gray-700 mb-2">
              💛 <strong>{formatCurrency(parseInt(amount))}</strong> 후원 신청 완료
            </p>
            <p className="text-body-sm text-gray-500">
              카카오페이 송금 확인 후 1-2일 내 반영됩니다.
            </p>
          </div>

          {/* 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/hwalseo"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-gray-900 text-white px-8 py-4 rounded-md font-semibold hover:bg-gray-800 transition-colors"
            >
              활서 읽으러 가기
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-white text-gray-900 border border-gray-300 px-8 py-4 rounded-md font-semibold hover:bg-gray-50 transition-colors"
            >
              홈으로
            </Link>
          </div>

          {/* 공유 섹션 */}
          <div className="border-t border-gray-200 pt-8">
            <p className="text-body text-gray-600 mb-4">
              이 마음을 나눠주세요 💕
            </p>
            <div className="flex justify-center gap-4">
              {/* 링크 복사 */}
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
                {copied ? '복사됨!' : '링크 복사'}
              </button>

              {/* 인스타그램 */}
              <button
                onClick={handleInstaShare}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                인스타그램
              </button>
            </div>
            <p className="text-caption text-gray-500 mt-4">
              복사한 링크를 카카오톡이나 SNS에 공유해주세요!
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}