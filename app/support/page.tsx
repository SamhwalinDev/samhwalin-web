'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import ScrollAnimationWrapper from '@/components/ui/ScrollAnimationWrapper';

export default function SupportPage() {
  useEffect(() => {
    document.title = '후원하기 | 삼활인';
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="py-20 bg-[#FFF8F3]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <ScrollAnimationWrapper animation="fade" duration={800}>
            <span className="text-5xl mb-6 block">💝</span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              삼활인을 후원해주세요
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              여러분의 후원이<br/>
              한 분의 인생을 기록하는 힘이 됩니다.
            </p>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* What Your Support Does */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollAnimationWrapper animation="fade-up" duration={800}>
            <h2 className="text-2xl font-bold text-center mb-12">
              후원금은 이렇게 쓰여요
            </h2>
          </ScrollAnimationWrapper>
          
          <div className="grid md:grid-cols-3 gap-8">
            <ScrollAnimationWrapper animation="fade-up" delay={0} duration={700}>
              <div className="text-center p-6">
                <span className="text-4xl mb-4 block">🎁</span>
                <h3 className="font-bold text-lg mb-2">감사 선물</h3>
                <p className="text-gray-600 text-sm">
                  인터뷰에 응해주신<br/>
                  분들께 드리는 작은 선물
                </p>
              </div>
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="fade-up" delay={150} duration={700}>
              <div className="text-center p-6">
                <span className="text-4xl mb-4 block">📖</span>
                <h3 className="font-bold text-lg mb-2">활서 제작</h3>
                <p className="text-gray-600 text-sm">
                  실물 활서 제본 및<br/>
                  마을 비치 비용
                </p>
              </div>
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="fade-up" delay={300} duration={700}>
              <div className="text-center p-6">
                <span className="text-4xl mb-4 block">🚗</span>
                <h3 className="font-bold text-lg mb-2">인터뷰 운영</h3>
                <p className="text-gray-600 text-sm">
                  강화도 방문 교통비 및<br/>
                  인터뷰 운영 비용
                </p>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>

      {/* Donation Options */}
      <section className="py-16 bg-[#F5F8F5]">
        <div className="max-w-2xl mx-auto px-6">
          <ScrollAnimationWrapper animation="fade" duration={800}>
            <h2 className="text-2xl font-bold text-center mb-4">
              후원 방법
            </h2>
            <p className="text-center text-gray-600 mb-12">
              토스로 간편하게 후원해주세요
            </p>
          </ScrollAnimationWrapper>

          {/* Toss QR */}
          <ScrollAnimationWrapper animation="fade-up" duration={700}>
            <div className="bg-white rounded-3xl p-8 shadow-sm max-w-md mx-auto">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💙</span>
                </div>
                <div>
                  <h3 className="font-bold text-xl">토스로 후원하기</h3>
                  <p className="text-gray-500 text-sm">QR 코드를 스캔해주세요</p>
                </div>
              </div>
              
              {/* QR Code Image */}
              <div className="flex justify-center mb-4">
                <img 
                  src="/images/toss-qr.jpg"
                  alt="토스 송금 QR"
                  className="w-48 h-48 rounded-xl"
                />
              </div>
              <p className="text-center text-gray-500 text-sm">
                토스 앱 → 홈 화면 QR 스캔
              </p>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Suggested Amounts */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-6">
          <ScrollAnimationWrapper animation="fade" duration={800}>
            <h2 className="text-2xl font-bold text-center mb-8">
              이만큼이면 이런 일이 가능해요
            </h2>
          </ScrollAnimationWrapper>
          
          <div className="space-y-4">
            <ScrollAnimationWrapper animation="fade-left" delay={0} duration={600}>
              <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-2xl">
                <span className="text-3xl">☕</span>
                <div>
                  <span className="font-bold text-orange-600">5,000원</span>
                  <span className="text-gray-600 ml-2">인터뷰 대상자분께 드리는 커피 한 잔</span>
                </div>
              </div>
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="fade-left" delay={100} duration={600}>
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl">
                <span className="text-3xl">🍚</span>
                <div>
                  <span className="font-bold text-green-600">10,000원</span>
                  <span className="text-gray-600 ml-2">인터뷰 후 함께하는 식사 한 끼</span>
                </div>
              </div>
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="fade-left" delay={200} duration={600}>
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl">
                <span className="text-3xl">📖</span>
                <div>
                  <span className="font-bold text-blue-600">30,000원</span>
                  <span className="text-gray-600 ml-2">활서 한 권 제본 비용</span>
                </div>
              </div>
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="fade-left" delay={300} duration={600}>
              <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-2xl">
                <span className="text-3xl">🎬</span>
                <div>
                  <span className="font-bold text-purple-600">100,000원</span>
                  <span className="text-gray-600 ml-2">영상 활서 촬영 및 편집</span>
                </div>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>

      {/* Thank You Message */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <ScrollAnimationWrapper animation="blur" duration={1000}>
            <h2 className="text-3xl font-bold text-white mb-4">
              감사합니다
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              여러분의 후원 덕분에<br/>
              한 분의 인생이 기록되고,<br/>
              그 지혜가 다음 세대로 이어집니다.
            </p>
            <p className="text-xl text-white font-medium">
              Arrive, Alive! No longer Alone.
            </p>
            
            <div className="mt-12 pt-8 border-t border-gray-700">
              <p className="text-gray-400 text-sm">
                후원 관련 문의: info@samhwalin.org
              </p>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

    </main>
  );
}