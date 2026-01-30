import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
import ScrollAnimationWrapper from '@/components/ui/ScrollAnimationWrapper';
import AboutCTA from '@/components/features/AboutCTA';

export const revalidate = 300;

export const metadata: Metadata = {
  title: '프로젝트 소개 | 삼활인',
  description:
    '삼활인은 인터뷰 대상자들의 인생 이야기를 기록하고, 세대를 넘어 연결하는 프로젝트입니다.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      
      {/* Section 1: HOOK (Hero) - Green tint */}
      <section className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F8F5' }}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text mb-6 leading-tight">
            <span className="animate-fade-in-up opacity-0" style={{ animationDelay: '0ms' }}>
              Arrive, Alive!
            </span>
            <br />
            <span className="text-primary animate-fade-in-up opacity-0" style={{ animationDelay: '200ms' }}>
              No longer Alone.
            </span>
          </h1>
          <p className="text-2xl md:text-3xl text-text mb-4 font-medium animate-fade-in-up opacity-0" style={{ animationDelay: '400ms' }}>
            Making People Alive and Connected
          </p>
          <p className="text-lg text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in-up opacity-0" style={{ animationDelay: '600ms' }}>
            삼활인은 유한한 삶을 기억하며 주어진 삶을 사랑하고 매일의 활력을 되찾는 지역과 세대 간 네트워킹 문화를 만들어갑니다.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-16 animate-fade-in-up opacity-0" style={{ animationDelay: '800ms' }}>
            <Link 
              href="/hwalseo"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-semibold hover:bg-primary/90 transition-all shadow-lg hover:-translate-y-0.5"
            >
              활서 읽기
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/testype"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold border-2 border-border text-text hover:bg-gray-100 transition-all shadow-lg hover:-translate-y-0.5"
            >
              테스형 만나기
            </Link>
          </div>
          <ChevronDown className="w-6 h-6 text-gray-400 mx-auto animate-bounce" />
        </div>
      </section>

      {/* Section 2: PROBLEM (Pain Points) - Dark */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollAnimationWrapper animation="fade" duration={1000}>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                왜 삼활인은 듣고 기록하려 하는가?
              </h2>
            </div>
          </ScrollAnimationWrapper>
          
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {[
              { 
                icon: '🏚️', 
                title: '고령화와 외로움',
                  desc: '고독사가 늘어나고 혼자 사는 분들이 증가합니다',
                animation: 'fade-right' as const
              },
              { 
                icon: '🚧', 
                title: '세대 간 단절',
                desc: '어른은 \'꼰대\'로 치부되고 대화의 창구가 사라졌습니다',
                animation: 'fade-left' as const
              },
              { 
                icon: '🧭', 
                title: '멘토의 부재',
                desc: '청년에겐 멘토가 없고 삶의 지혜를 구할 곳이 없습니다',
                animation: 'fade-right' as const
              },
              { 
                icon: '💔', 
                title: '활력 상실',
                  desc: '요양원과 홀로 사는 분들이 삶의 의미를 잃어갑니다',
                animation: 'fade-left' as const
              },
            ].map((item, index) => (
              <ScrollAnimationWrapper 
                key={index}
                animation={item.animation}
                delay={index * 150}
                duration={800}
              >
                <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{item.desc}</p>
                </div>
              </ScrollAnimationWrapper>
            ))}
          </div>
          
          <ScrollAnimationWrapper animation="fade-up" delay={600} duration={1000}>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                따라서, 삼활인은 잊히지 않는 삶을 잇는 활력 공동체를 만들겠다고 다짐했습니다.
              </p>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Section 3: EPIPHANY (The Realization) - White */}
      <ScrollAnimationWrapper animation="blur" duration={1200}>
        <section className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <ScrollAnimationWrapper animation="fade" delay={200} duration={800}>
              <p className="text-primary font-medium mb-4">그런데 우리는 깨달았습니다</p>
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="fade-up" delay={400} duration={1000}>
              <h2 className="text-4xl md:text-5xl font-bold text-text mb-8 leading-tight">
                황혼에 다다른 분들의 삶 속에<br />
                <span className="text-primary">청년들이 찾는 답</span>이<br />
                있었습니다
              </h2>
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="fade-up" delay={600} duration={900}>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                긴 세월을 살아내며 얻은 경륜, 실패와 성공, 후회와 깨달음,<br />
                그 모든 이야기 속에 우리가 찾던 지혜가 숨어 있었습니다.
              </p>
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="scale" delay={800} duration={900}>
              <div className="bg-background rounded-2xl p-8">
                <p className="text-2xl font-bold text-text">
                  문제는 단 하나.<br />
                  <span className="text-red-600">아무도 기록하지 않고 공유하지 않았다는 것.</span>
                </p>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </section>
      </ScrollAnimationWrapper>

      {/* Section 4: STORY (Philosophy & Journey) - Purple tint */}
      <section className="py-24" style={{ backgroundColor: '#F8F8FB' }}>
        <div className="max-w-5xl mx-auto px-6">
          <ScrollAnimationWrapper animation="fade" duration={800}>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-text mb-6">
                삼활인의 철학
              </h2>
              <p className="text-lg text-gray-600">
                세 가지 가치가 하나의 흐름으로 연결됩니다
              </p>
            </div>
          </ScrollAnimationWrapper>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4 mb-16">
            {[
              { 
                icon: '💀', 
                title: 'Memento Mori',
                subtitle: '죽음을 기억하라',
                desc: '삶의 유한함을 기억하기에 기록의 가치를 깨닫습니다' 
              },
              { 
                icon: '❤️', 
                title: 'Amor Fati',
                subtitle: '운명을 사랑하라',
                desc: '지나온 삶을 부정하지 않고 있는 그대로 사랑합니다' 
              },
              { 
                icon: '☀️', 
                title: 'Carpe Diem',
                subtitle: '오늘을 충만히 살아라',
                desc: '영원한 가치를 좇으며 매일의 활력을 되찾습니다' 
              },
            ].map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row items-center">
                <ScrollAnimationWrapper animation="scale" delay={index * 200} duration={700}>
                  <div className="bg-white rounded-3xl p-8 shadow-md max-w-xs text-center">
                    <div className="text-5xl mb-4">{item.icon}</div>
                    <h3 className="text-xl font-bold text-text mb-2">{item.title}</h3>
                    <p className="text-primary font-semibold mb-3">{item.subtitle}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </ScrollAnimationWrapper>
                {index < 2 && (
                  <ArrowRight className="w-8 h-8 text-primary mx-4 hidden md:block rotate-0 md:rotate-0" />
                )}
                {index < 2 && (
                  <ChevronDown className="w-8 h-8 text-primary my-4 md:hidden" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: SOLUTION (어라이브 프로젝트) - White */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollAnimationWrapper animation="fade-up" duration={800}>
            <div className="text-center mb-16">
              <p className="text-primary font-medium mb-2">Our Solution</p>
              <h2 className="text-4xl md:text-5xl font-bold text-text mb-4">
                어라이브 프로젝트
              </h2>
              <p className="text-lg text-gray-600">
                인터뷰 기반 생애 기록 프로젝트
              </p>
            </div>
          </ScrollAnimationWrapper>

          {/* Process Steps */}
          <div className="mb-16">
            <div className="border-l-4 border-primary pl-8 space-y-8">
              {[
                { 
                  title: '인터뷰 & 라포 형성',
                  desc: '1~2시간 대면 인터뷰, 지속적인 관계 유지'
                },
                { 
                  title: '웹 활서 발행',
                  desc: '청년을 위한 인사이트 뉴스레터로 삶의 교훈 전달'
                },
                { 
                  title: '질문 교류',
                  desc: '독자가 인터뷰 대상자에게 질문, 직접 답변'
                },
                { 
                  title: '실물 & 영상 활서',
                  desc: '제본해서 마을에 비치, 강점 기반 영상 제작'
                },
              ].map((step, index) => (
                <ScrollAnimationWrapper key={index} animation="fade-up" delay={index * 200} duration={800}>
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <h3 className="text-xl font-bold text-text">{step.title}</h3>
                    </div>
                    <p className="text-gray-600 ml-12">{step.desc}</p>
                  </div>
                </ScrollAnimationWrapper>
              ))}
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            <ScrollAnimationWrapper animation="fade-right" delay={0} duration={900}>
              <div className="rounded-3xl p-8 shadow-lg border border-gray-100" style={{ backgroundColor: '#FFF8F3' }}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">📖</span>
                  <div>
                    <h3 className="text-2xl font-bold text-text">활서 (活書)</h3>
                    <p className="text-gray-600">活(살 활) + 書(글 서)</p>
                  </div>
                </div>
                <p className="text-lg font-semibold text-primary mb-3">사람을 살리는 글</p>
                <p className="text-text mb-6 leading-relaxed">
                  인터뷰 대상자의 삶을 기록한 웹/영상/실물 콘텐츠입니다
                </p>
                <Link 
                  href="/hwalseo"
                  className="text-primary font-semibold hover:underline"
                >
                  활서 보러가기 →
                </Link>
              </div>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper animation="fade-left" delay={150} duration={900}>
              <div className="rounded-3xl p-8 shadow-lg border border-gray-100 relative" style={{ backgroundColor: '#F5F8F5' }}>
                <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                  Coming Soon
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">💬</span>
                  <div>
                    <h3 className="text-2xl font-bold text-text">테스형 AI</h3>
                  </div>
                </div>
                <p className="text-lg font-semibold text-green-700 mb-3">100명 인터뷰 대상자의 지혜가 담긴 AI</p>
                <p className="text-text mb-6 leading-relaxed">
                  실제 삶의 이야기에서 답을 찾습니다
                </p>
                <Link 
                  href="/testype"
                  className="text-green-700 font-semibold hover:underline"
                >
                  테스형 만나기 →
                </Link>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>

      {/* Section 6: PROOF (Goals & Values) - Green tint */}
      <section className="py-24" style={{ backgroundColor: '#F5F8F5' }}>
        <div className="max-w-5xl mx-auto px-6">
          <ScrollAnimationWrapper animation="fade" duration={800}>
            <div className="text-center mb-16">
              <p className="text-primary font-medium mb-2">Our Goals</p>
              <h2 className="text-4xl md:text-5xl font-bold text-text mb-12">
                우리의 목표
              </h2>
            </div>
          </ScrollAnimationWrapper>

          {/* Goal Numbers */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { number: '50명', desc: '2026년까지 기록할 인터뷰 대상자' },
              { number: '10개', desc: '2027년까지 확장할 마을' },
              { number: '1,000명', desc: '연결할 청년 독자' },
            ].map((goal, index) => (
              <ScrollAnimationWrapper key={index} animation="scale" delay={index * 200} duration={800}>
                <div className="text-center">
                  <div className="text-5xl md:text-6xl font-bold text-primary mb-4">
                    {goal.number}
                  </div>
                  <p className="text-lg text-text font-medium">{goal.desc}</p>
                </div>
              </ScrollAnimationWrapper>
            ))}
          </div>

          <ScrollAnimationWrapper animation="fade-up" delay={600} duration={800}>
            {/* Core Values */}
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: '🔗', label: 'Networking' },
                { icon: '📝', label: 'Remembering' },
                { icon: '📚', label: 'Archiving' },
                { icon: '🎉', label: 'Enjoying' },
              ].map((value, index) => (
                <div 
                  key={index}
                  className="bg-white px-6 py-4 rounded-2xl shadow-sm flex items-center gap-3"
                >
                  <span className="text-2xl">{value.icon}</span>
                  <span className="font-semibold text-text">{value.label}</span>
                </div>
              ))}
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Section 7: VISION (Future Roadmap) - White */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollAnimationWrapper animation="fade-up" duration={800}>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-text mb-12">
                우리가 꿈꾸는 미래
              </h2>
            </div>
          </ScrollAnimationWrapper>

          {/* Timeline */}
          <div className="relative">
            {/* Horizontal line for desktop */}
            <div className="hidden md:block absolute top-8 left-0 right-0 h-1 bg-gray-200"></div>
            
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { 
                  year: '현재',
                  desc: '강화도 인터뷰 대상자 기록 시작',
                  active: true
                },
                { 
                  year: '2026',
                  desc: '인터뷰 대상자 50명 기록\n테스형 AI 베타 출시',
                  active: false
                },
                { 
                  year: '2027',
                  desc: '전국 10개 마을로 확장',
                  active: false
                },
                { 
                  year: '2030',
                  desc: '모든 인터뷰 대상자가 기억되는 세상',
                  active: false
                },
              ].map((milestone, index) => (
                <ScrollAnimationWrapper 
                  key={index} 
                  animation="fade-up" 
                  delay={index * 250} 
                  duration={900}
                >
                  <div className="text-center relative">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center font-bold text-lg relative z-10 ${
                      milestone.active 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      📍
                    </div>
                    <h3 className="text-xl font-bold text-text mb-3">
                      {milestone.year}
                    </h3>
                    <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                      {milestone.desc}
                    </p>
                  </div>
                </ScrollAnimationWrapper>
              ))}
            </div>
          </div>

          <ScrollAnimationWrapper animation="fade-up" delay={1000} duration={1000}>
            <div className="text-center mt-16">
              <p className="text-2xl font-bold text-text mb-4">
                한 세대의 이야기가 다음 세대의 지혜가 되는 세상
              </p>
              <p className="text-xl text-primary font-semibold">
                Making People Alive and Connected
              </p>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Section 8: OFFER (CTA - Value Ladder) - Primary Dark */}
      <ScrollAnimationWrapper animation="blur" duration={1000}>
        <AboutCTA />
      </ScrollAnimationWrapper>

    </main>
  );
}
