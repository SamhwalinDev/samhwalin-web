import Link from 'next/link';
import { Container, Section } from '@/components/layout';
import { BeforeIDieBanner, MissionSection } from '@/components/features';
import DarkSubscribeSection from '@/components/features/DarkSubscribeSection';
import { ProxiedImage } from '@/components/ui';
import ScrollAnimationWrapper from '@/components/ui/ScrollAnimationWrapper';
import { getHwalseoList, getElderList, getEldersWithQuotes } from '@/lib/notion';
import { formatDate, formatTitleParts } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export const revalidate = 60;

export default async function HomePage() {
  const [hwalseoList, elders, eldersWithQuotes] = await Promise.all([
    getHwalseoList(),
    getElderList(),
    getEldersWithQuotes(),
  ]);

  const latestHwalseo = hwalseoList.length > 0 ? hwalseoList[0] : null;
  const featuredElder = elders.find((e) => e.photo) || elders[0];

  return (
    <main className="min-h-screen bg-gray-50">
      
      {/* ========== HERO SECTION - Two Column ========== */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div>
              <ScrollAnimationWrapper animation="fade-up" delay={0} duration={800}>
                <div className="space-y-4">
                  {/* English - Sub headline (small, one line) */}
                  <p className="text-lg sm:text-xl md:text-2xl font-semibold">
                    <span className="bg-gradient-to-r from-gray-700 via-orange-400 to-orange-500 bg-clip-text text-transparent">
                      Arrive, Alive! No longer Alone.
                    </span>
                  </p>
                  
                  {/* Korean - Main headline (large) */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    잊히지 않는 삶을 잇습니다
                  </h1>
                  
                  {/* Description */}
                  <p className="text-base sm:text-lg text-gray-600 max-w-lg leading-relaxed">
                    삼활인은 인터뷰 대상자들의 삶을 기록하고, 세대를 연결하며,
                    함께하는 기쁨을 나누는 사회적 기업입니다.
                  </p>
                </div>
              </ScrollAnimationWrapper>
              
              <ScrollAnimationWrapper animation="fade-up" delay={200} duration={800}>
                <span className="inline-block px-4 py-2 bg-orange-100 text-orange-600 text-sm font-medium rounded-full mb-6 mt-6">
                  새 활서가 도착했어요
                </span>
              </ScrollAnimationWrapper>
              
              <ScrollAnimationWrapper animation="fade-up" delay={600} duration={800}>
                <div className="flex flex-wrap gap-4">
                  <Link 
                    href={latestHwalseo ? `/hwalseo/${latestHwalseo.slug}` : '/hwalseo'}
                    className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-semibold hover:bg-primary/90 transition-all hover:-translate-y-0.5 shadow-lg"
                    style={{ boxShadow: '0 10px 40px rgba(244, 146, 73, 0.3)' }}
                  >
                    최신 활서 읽기
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link 
                    href="/about"
                    className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    삼활인 알아보기
                  </Link>
                </div>
              </ScrollAnimationWrapper>
            </div>
            
            {/* Right: Featured Card */}
            {latestHwalseo && (
              <ScrollAnimationWrapper animation="scale" delay={300} duration={1000}>
                <div className="relative">
                  <Link 
                    href={`/hwalseo/${latestHwalseo.slug}`}
                    className="block bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-1"
                  >
                    <div className="h-64 bg-gradient-to-br from-orange-100 to-orange-50 relative overflow-hidden">
                      {latestHwalseo.coverImage ? (
                        <ProxiedImage
                          src={latestHwalseo.coverImage}
                          alt={latestHwalseo.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-6xl">📜</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <span className="text-primary text-sm font-semibold">
                        {latestHwalseo.theme || '활서'}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 mt-2 mb-2 line-clamp-2">
                        {formatTitleParts(latestHwalseo.title).map((part, index) => (
                          <span key={index}>
                            {index > 0 && <br />}
                            {part}
                          </span>
                        ))}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {latestHwalseo.elderName}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{formatDate ? formatDate(latestHwalseo.publishedAt) : latestHwalseo.publishedAt}</span>
                      </div>
                    </div>
                  </Link>
                  {/* Decorative background */}
                  <div className="absolute -z-10 -bottom-4 -right-4 w-full h-full bg-orange-100 rounded-3xl"></div>
                </div>
              </ScrollAnimationWrapper>
            )}
          </div>
        </div>
      </section>

      {/* ========== BEFORE I DIE BANNER ========== */}
      {eldersWithQuotes && eldersWithQuotes.length > 0 && (
        <ScrollAnimationWrapper animation="fade" duration={1000}>
          <section className="py-12" style={{ backgroundColor: '#FFF8F3' }}>
            <div className="max-w-4xl mx-auto px-6">
              <BeforeIDieBanner elders={eldersWithQuotes} />
            </div>
          </section>
        </ScrollAnimationWrapper>
      )}

      {/* ========== ELDER SPOTLIGHT ========== */}
      {featuredElder && (
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <ScrollAnimationWrapper animation="fade-up" duration={800}>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  프로필을 만나보세요
                </h2>
                <p className="text-lg text-gray-600">
                  삼활인이 기록한 이야기의 주인공들
                </p>
              </div>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper animation="scale" delay={200} duration={900}>
              <Link
                href={`/elders/${featuredElder.slug}`}
                className="block max-w-2xl mx-auto bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-56 h-56 sm:h-auto bg-gray-200 relative">
                    {featuredElder.photo ? (
                      <ProxiedImage
                        src={featuredElder.photo}
                        alt={featuredElder.name}
                        fill
                        className="object-cover object-top"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-7xl">
                        {featuredElder.gender === '여성' ? '👵' : '👴'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-8">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold text-gray-900">{featuredElder.name}</h3>
                      <span className="text-gray-500">· {featuredElder.region}</span>
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed line-clamp-2">
                      {featuredElder.introduction || `${featuredElder.name}님의 이야기를 만나보세요.`}
                    </p>
                    <span className="text-primary font-semibold">
                      활서 {featuredElder.hwalseoCount || 0}편 →
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollAnimationWrapper>

            {elders.length > 1 && (
              <ScrollAnimationWrapper animation="fade-up" delay={400} duration={700}>
                <div className="text-center mt-8">
                  <Link href="/elders" className="text-gray-500 hover:text-gray-900 transition-colors">
                    모든 프로필 보기 ({elders.length}명) →
                  </Link>
                </div>
              </ScrollAnimationWrapper>
            )}
          </div>
        </section>
      )}

      {/* ========== LATEST HWALSEO ========== */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollAnimationWrapper animation="fade-up" duration={800}>
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  최신 활서
                </h2>
                <p className="text-gray-600">인터뷰 대상자들의 생생한 이야기</p>
              </div>
              <Link href="/hwalseo" className="hidden sm:block text-primary font-semibold hover:text-primary/80 transition-colors">
                모두 보기 →
              </Link>
            </div>
          </ScrollAnimationWrapper>

          <div className="grid md:grid-cols-3 gap-6">
            {hwalseoList.slice(0, 3).map((hwalseo, index) => (
              <ScrollAnimationWrapper 
                key={hwalseo.id} 
                animation="fade-up" 
                delay={index * 200} 
                duration={800}
              >
                <Link
                  href={`/hwalseo/${hwalseo.slug}`}
                  className="block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1 group"
                >
                  <div className="h-48 bg-gray-100 relative overflow-hidden">
                    {hwalseo.coverImage ? (
                      <ProxiedImage
                        src={hwalseo.coverImage}
                        alt={hwalseo.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50">
                        <span className="text-5xl opacity-50">📜</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <span className="text-primary text-sm font-semibold">{hwalseo.theme || '활서'}</span>
                    <h3 className="text-lg font-bold text-gray-900 mt-2 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {formatTitleParts(hwalseo.title).map((part, index) => (
                        <span key={index}>
                          {index > 0 && <br />}
                          {part}
                        </span>
                      ))}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{hwalseo.elderName}</span>
                      <span>{formatDate ? formatDate(hwalseo.publishedAt) : hwalseo.publishedAt}</span>
                    </div>
                  </div>
                </Link>
              </ScrollAnimationWrapper>
            ))}
          </div>

          <ScrollAnimationWrapper animation="fade-up" delay={600} duration={700}>
            <div className="text-center mt-8 sm:hidden">
              <Link href="/hwalseo" className="text-primary font-semibold">모두 보기 →</Link>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* ========== MISSION SECTION ========== */}
      <section className="py-16 md:py-24" style={{ backgroundColor: '#F5F8F5' }}>
        <div className="max-w-5xl mx-auto px-6">
          <ScrollAnimationWrapper animation="fade-up" duration={800}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                삼활인이 하는 일
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                유한한 삶을 기억하며, 주어진 삶을 사랑하고,<br />
                매일의 활력을 되찾는 문화를 만들어갑니다.
              </p>
            </div>
          </ScrollAnimationWrapper>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🩷', title: 'Remembering', desc: '오랜 세월을 살아오신 분들의 삶을 기억합니다' },
              { icon: '🤝', title: 'Networking', desc: '세대 간 연결을 만들어갑니다' },
              { icon: '📖', title: 'Archiving', desc: '소중한 이야기를 기록합니다' },
              { icon: '✨', title: 'Enjoying', desc: '함께하는 기쁨을 나눕니다' },
            ].map((item, index) => (
              <ScrollAnimationWrapper 
                key={index}
                animation="scale" 
                delay={index * 150} 
                duration={700}
              >
                <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </ScrollAnimationWrapper>
            ))}
          </div>

          <ScrollAnimationWrapper animation="fade-up" delay={600} duration={800}>
            <div className="text-center mt-10">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-gray-300 rounded-2xl text-gray-700 font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all"
              >
                삼활인 더 알아보기
              </Link>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* ========== SEARCH COMING SOON ========== */}
      <ScrollAnimationWrapper animation="blur" duration={1200}>
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <ScrollAnimationWrapper animation="scale" delay={200} duration={800}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm mb-6">
                <span className="text-3xl">🔍</span>
              </div>
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="fade-up" delay={400} duration={800}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                고민이 있으신가요?
              </h2>
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="fade-up" delay={600} duration={800}>
              <p className="text-lg text-gray-600 mb-8">
                인터뷰 대상자들의 지혜에서 답을 찾아보세요
              </p>
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="fade-up" delay={800} duration={800}>
              <div className="relative max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="예: 창업, 결혼, 건강..."
                  disabled
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 text-lg bg-white cursor-not-allowed text-gray-400"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
                  🔒
                </div>
              </div>
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="fade" delay={1000} duration={700}>
              <p className="text-sm text-gray-400 mt-4">
                * 검색 기능은 활서 30편 이상 쌓이면 오픈됩니다
              </p>
            </ScrollAnimationWrapper>
          </div>
        </section>
      </ScrollAnimationWrapper>

      {/* ========== EMAIL SUBSCRIBE ========== */}
      <DarkSubscribeSection source="홈페이지" />

    </main>
  );
}