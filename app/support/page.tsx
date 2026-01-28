'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Coffee, Utensils, BookOpen, Camera, Video } from 'lucide-react';
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
      <section id="donate" className="py-16 bg-[#F5F8F5]">
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
            {[
              { amount: '5,000원', description: '인터뷰 교통비', icon: Coffee, color: 'orange' },
              { amount: '10,000원', description: '따뜻한 식사 한 끼', icon: Utensils, color: 'green' },
              { amount: '30,000원', description: '활서 1편 제작', icon: BookOpen, color: 'blue' },
              { amount: '50,000원', description: '사진 한 장의 기록', icon: Camera, color: 'purple' },
              { amount: '100,000원', description: '영상으로 남기는 삶', icon: Video, color: 'pink' },
            ].map((item, index) => {
              const Icon = item.icon;
              const bgColorMap: Record<string, string> = {
                orange: 'bg-orange-50',
                green: 'bg-green-50',
                blue: 'bg-blue-50',
                purple: 'bg-purple-50',
                pink: 'bg-pink-50',
              };
              const textColorMap: Record<string, string> = {
                orange: 'text-orange-600',
                green: 'text-green-600',
                blue: 'text-blue-600',
                purple: 'text-purple-600',
                pink: 'text-pink-600',
              };
              
              return (
                <ScrollAnimationWrapper key={item.amount} animation="fade-left" delay={index * 100} duration={600}>
                  <div className={`flex items-center gap-4 p-4 ${bgColorMap[item.color]} rounded-2xl`}>
                    <div className="flex-shrink-0">
                      <Icon className={`w-8 h-8 ${textColorMap[item.color]}`} />
                    </div>
                    <div>
                      <span className={`font-bold ${textColorMap[item.color]}`}>{item.amount}</span>
                      <span className="text-gray-600 ml-2">{item.description}</span>
                    </div>
                  </div>
                </ScrollAnimationWrapper>
              );
            })}
          </div>
        </div>
      </section>

      {/* Growth Story + Tier Section */}
      <section className="py-16 bg-gradient-to-b from-white to-orange-50">
        <div className="max-w-4xl mx-auto px-4">
          {/* Growth Story Header */}
          <ScrollAnimationWrapper animation="fade" duration={800}>
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                🌱 씨앗에서 🌲 숲으로
              </h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                작은 씨앗이 모여 큰 숲을 이룹니다.<br />
                당신의 후원이 한 분의 이야기를 피워냅니다.
              </p>
            </div>
          </ScrollAnimationWrapper>
          
          {/* Growth Journey Visual */}
          <ScrollAnimationWrapper animation="fade-up" delay={200} duration={700}>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2 mb-12">
              {/* 씨앗 */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                  🌱
                </div>
                <p className="font-bold mt-2">씨앗</p>
                <p className="text-xs text-gray-500">일시 후원</p>
              </div>
              
              <div className="hidden md:block text-gray-300 text-2xl">→</div>
              <div className="md:hidden text-gray-300 text-2xl">↓</div>
              
              {/* 새싹 */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-2xl">
                  🌿
                </div>
                <p className="font-bold mt-2">새싹</p>
                <p className="text-xs text-gray-500">월 5,000원+</p>
              </div>
              
              <div className="hidden md:block text-gray-300 text-2xl">→</div>
              <div className="md:hidden text-gray-300 text-2xl">↓</div>
              
              {/* 나무 */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-2xl">
                  🌳
                </div>
                <p className="font-bold mt-2">나무</p>
                <p className="text-xs text-gray-500">월 30,000원+</p>
              </div>
              
              <div className="hidden md:block text-gray-300 text-2xl">→</div>
              <div className="md:hidden text-gray-300 text-2xl">↓</div>
              
              {/* 숲 */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-2xl">
                  🌲
                </div>
                <p className="font-bold mt-2">숲</p>
                <p className="text-xs text-gray-500">월 100,000원+</p>
              </div>
            </div>
          </ScrollAnimationWrapper>
          
          {/* Tier Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 씨앗 */}
            <ScrollAnimationWrapper animation="fade-up" delay={0} duration={600}>
              <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-gray-300 transition-all">
                <div className="text-3xl mb-3">🌱</div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">씨앗</h3>
                <p className="text-sm text-gray-500 font-medium mb-4">일시 후원</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400">✓</span>
                    도너스 월 이름 게시
                  </li>
                </ul>
              </div>
            </ScrollAnimationWrapper>
            
            {/* 새싹 */}
            <ScrollAnimationWrapper animation="fade-up" delay={100} duration={600}>
              <div className="bg-white rounded-2xl p-6 border-2 border-green-200 hover:border-green-300 transition-all">
                <div className="text-3xl mb-3">🌿</div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">새싹</h3>
                <p className="text-sm text-green-600 font-medium mb-4">월 5,000원+</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    도너스 월 이름 게시
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    활서 크레딧 등재
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    후원자 전용 뉴스레터
                  </li>
                </ul>
              </div>
            </ScrollAnimationWrapper>
            
            {/* 나무 */}
            <ScrollAnimationWrapper animation="fade-up" delay={200} duration={600}>
              <div className="bg-white rounded-2xl p-6 border-2 border-orange-300 hover:border-orange-400 transition-all relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-400 text-white text-xs px-3 py-1 rounded-full font-medium">
                  추천
                </div>
                <div className="text-3xl mb-3">🌳</div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">나무</h3>
                <p className="text-sm text-orange-500 font-medium mb-4">월 30,000원+</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400">✓</span>
                    새싹 혜택 전체
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400">✓</span>
                    활서 먼저 보기
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400">✓</span>
                    비하인드 스토리
                  </li>
                </ul>
              </div>
            </ScrollAnimationWrapper>
            
            {/* 숲 */}
            <ScrollAnimationWrapper animation="fade-up" delay={300} duration={600}>
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border-2 border-orange-400 hover:shadow-lg transition-all">
                <div className="text-3xl mb-3">🌲</div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">숲</h3>
                <p className="text-sm text-orange-600 font-medium mb-4">월 100,000원+</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">✓</span>
                    나무 혜택 전체
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">✓</span>
                    오프라인 모임 초대
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">✓</span>
                    어르신 선정 투표권
                  </li>
                </ul>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>

      {/* Donor Wall Section */}
      <section id="donors" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <ScrollAnimationWrapper animation="fade" duration={800}>
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">
              💛 함께해주신 분들
            </h2>
            <p className="text-center text-gray-600 mb-10">
              소중한 후원으로 이야기를 이어가고 있습니다
            </p>
          </ScrollAnimationWrapper>
          
          {/* Donor Lists by Tier */}
          <div className="space-y-6">
            {/* 숲 */}
            <ScrollAnimationWrapper animation="fade-up" delay={0} duration={600}>
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🌲</span>
                  <h3 className="font-bold text-gray-900">숲</h3>
                  <span className="text-xs text-gray-500">월 100,000원+</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-4 py-2 bg-white/80 rounded-full text-sm text-gray-500 italic">
                    첫 번째 숲 후원자를 기다립니다 💛
                  </span>
                </div>
              </div>
            </ScrollAnimationWrapper>
            
            {/* 나무 */}
            <ScrollAnimationWrapper animation="fade-up" delay={100} duration={600}>
              <div className="bg-orange-50/50 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🌳</span>
                  <h3 className="font-bold text-gray-900">나무</h3>
                  <span className="text-xs text-gray-500">월 30,000원+</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-4 py-2 bg-white/80 rounded-full text-sm text-gray-500 italic">
                    첫 번째 나무 후원자를 기다립니다 🌳
                  </span>
                </div>
              </div>
            </ScrollAnimationWrapper>
            
            {/* 새싹 */}
            <ScrollAnimationWrapper animation="fade-up" delay={200} duration={600}>
              <div className="bg-green-50/50 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🌿</span>
                  <h3 className="font-bold text-gray-900">새싹</h3>
                  <span className="text-xs text-gray-500">월 5,000원+</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-4 py-2 bg-white/80 rounded-full text-sm text-gray-500 italic">
                    첫 번째 새싹 후원자를 기다립니다 🌿
                  </span>
                </div>
              </div>
            </ScrollAnimationWrapper>
            
            {/* 씨앗 */}
            <ScrollAnimationWrapper animation="fade-up" delay={300} duration={600}>
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🌱</span>
                  <h3 className="font-bold text-gray-900">씨앗</h3>
                  <span className="text-xs text-gray-500">일시 후원</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-4 py-2 bg-white/80 rounded-full text-sm text-gray-500 italic">
                    첫 번째 씨앗 후원자를 기다립니다 🌱
                  </span>
                </div>
              </div>
            </ScrollAnimationWrapper>
          </div>
          
          {/* CTA */}
          <ScrollAnimationWrapper animation="fade-up" delay={400} duration={600}>
            <div className="text-center mt-10">
              <p className="text-gray-500 text-sm mb-4">
                후원해주시면 이곳에 이름을 새겨드립니다
              </p>
              <a 
                href="#donate" 
                className="inline-block bg-orange-400 hover:bg-orange-500 text-white px-8 py-3 rounded-full font-bold transition-all"
              >
                후원으로 함께하기 →
              </a>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Monthly Donation Section */}
      <section id="monthly" className="py-16 bg-gray-900 text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <ScrollAnimationWrapper animation="blur" duration={1000}>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              🌿 정기 후원 안내
            </h2>
            <p className="text-gray-300 mb-8">
              매월 정기적으로 후원해주시면 더 많은 이야기를 기록할 수 있습니다.<br />
              아래 연락처로 문의해주시면 정기 후원 방법을 안내드립니다.
            </p>
            
            <div className="bg-gray-800 rounded-2xl p-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl">📧</span>
                  <a href="mailto:info@samhwalin.org" className="text-gray-300 hover:text-white hover:underline">
                    info@samhwalin.org
                  </a>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl">📞</span>
                  <span className="text-white">010-2455-4811</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">🌿 새싹: 월 5,000원+</span>
              <span className="flex items-center gap-1">🌳 나무: 월 30,000원+</span>
              <span className="flex items-center gap-1">🌲 숲: 월 100,000원+</span>
            </div>
          </ScrollAnimationWrapper>
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