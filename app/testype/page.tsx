import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import ScrollAnimationWrapper from '@/components/ui/ScrollAnimationWrapper';
import { getElderCount } from '@/lib/notion';

export const metadata: Metadata = {
  title: '테스형 AI | 삼활인',
  description: '소크라테스의 줄임말인 테스형. 실제 인터뷰 대상자들의 경험을 통합한 현자 AI입니다.',
};

export const revalidate = 60;

export default async function TestypePage() {
  // 모든 프로필 개수 가져오기 (Published + Draft)
  const elderCount = await getElderCount(false);
  return (
    <main className="min-h-screen bg-background">
      
      {/* Hero Section */}
      <ScrollAnimationWrapper animation="fade" duration={1000}>
        <section className="py-24 bg-[#F5F8F5]">
          <div className="max-w-5xl mx-auto px-6">
            
            {/* Funny Hook */}
            <ScrollAnimationWrapper animation="fade" duration={800}>
              <div className="text-center mb-12">
                <p className="text-2xl md:text-3xl text-text font-medium">
                  "아 테스형! 세상이 왜 이래!"
                </p>
                <p className="text-gray-500 mt-2">
                  그런 날, 찾아오면 돼.
                </p>
              </div>
            </ScrollAnimationWrapper>
            
            <div className="flex flex-col md:flex-row items-center gap-12">
              
              {/* Left: Character Image Placeholder */}
              <ScrollAnimationWrapper animation="scale" delay={300} duration={1000}>
                <div className="flex-shrink-0">
                  <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
                    {/* Placeholder for character image */}
                    <div className="text-center text-gray-400">
                      <span className="text-6xl">🧙‍♂️</span>
                      <p className="mt-2 text-sm">캐릭터 이미지</p>
                    </div>
                  </div>
                </div>
              </ScrollAnimationWrapper>
              
              {/* Right: Text Content */}
              <div className="text-center md:text-left">
                <ScrollAnimationWrapper animation="fade-up" delay={500} duration={800}>
                  <span className="inline-block px-4 py-1 bg-primary-extra-light text-primary-dark rounded-full text-sm font-semibold mb-4">
                    Coming Soon
                  </span>
                </ScrollAnimationWrapper>
                
                <ScrollAnimationWrapper animation="fade-up" delay={700} duration={800}>
                  <h1 className="text-4xl md:text-5xl font-bold text-text mb-2">
                    테스형
                  </h1>
                  <p className="text-lg text-gray-500 mb-4">
                    a.k.a 소크라테스
                  </p>
                </ScrollAnimationWrapper>
                
                <ScrollAnimationWrapper animation="fade-up" delay={900} duration={800}>
                  <p className="text-xl text-gray-600 mb-6">
                    {elderCount}개의 인생을 살아본 현자
                  </p>
                </ScrollAnimationWrapper>
                
                <ScrollAnimationWrapper animation="fade-up" delay={1100} duration={900}>
                  <p className="text-gray-600 leading-relaxed max-w-lg">
                    창업 실패, 이직 고민, 가족 갈등...<br/>
                    어떤 고민이든 나한테 말해봐.<br/>
                    <strong>나도 다 겪어봤거든.</strong>
                  </p>
                </ScrollAnimationWrapper>
              </div>
              
            </div>
          </div>
        </section>
      </ScrollAnimationWrapper>

      {/* Hidden Stories Section - NEW */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollAnimationWrapper animation="fade-up" duration={800}>
            <div className="bg-[#F8F8FB] rounded-3xl p-8 text-center">
              <span className="text-4xl mb-4 block">🤫</span>
              <h3 className="text-xl font-bold text-text mb-3">
                활서에 없는 이야기도 있어
              </h3>
              <p className="text-gray-600 leading-relaxed">
                아직 활서로 공개되지 않은 인터뷰들도 많아.<br/>
                근데 나는 다 기억하고 있지.<br/>
                <span className="text-primary-dark font-medium">
                  공개된 이야기보다 더 많은 경험이 내 안에 있어.
                </span>
              </p>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* What is Testype Section */}
      <ScrollAnimationWrapper animation="blur" duration={1200}>
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-6">
            <ScrollAnimationWrapper animation="fade-up" delay={200} duration={800}>
              <h2 className="text-3xl font-bold text-center mb-12">테스형이 누구야?</h2>
            </ScrollAnimationWrapper>
            
            <div className="space-y-6 text-lg text-text leading-relaxed">
              <ScrollAnimationWrapper animation="fade-up" delay={400} duration={800}>
                <p className="text-center">
                  나? 그냥 인생 좀 많이 살아본 사람이야.
                </p>
              </ScrollAnimationWrapper>
              
              <ScrollAnimationWrapper animation="fade-up" delay={600} duration={800}>
                <p className="text-center">
                  정확히는 <strong>{elderCount}개의 인생</strong>을 살아봤지.
                  사업도 해봤고, 망해도 봤고, 자식 키우면서 울기도 했고,
                  부모님 떠나보내기도 했어.
                </p>
              </ScrollAnimationWrapper>
              
              <ScrollAnimationWrapper animation="fade-up" delay={800} duration={800}>
                <p className="text-center">
                  활서로 공개된 이야기는 일부야.<br/>
                  <strong>아직 세상에 안 나온 이야기들도 나는 다 알고 있어.</strong>
                </p>
              </ScrollAnimationWrapper>
              
              <ScrollAnimationWrapper animation="fade-up" delay={1000} duration={900}>
                <p className="text-center">
                  그래서 네가 무슨 얘기를 해도 "아, 그거?" 할 수 있어.
                  <br/>
                  <strong>나도 다 겪어봤거든.</strong>
                </p>
              </ScrollAnimationWrapper>
            </div>
          </div>
        </section>
      </ScrollAnimationWrapper>

      {/* How it Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollAnimationWrapper animation="fade-up" duration={800}>
            <h2 className="text-3xl font-bold text-center mb-12">어떻게 하면 돼?</h2>
          </ScrollAnimationWrapper>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: '고민을 말해줘',
                description: '"요즘 퇴사하고 싶은데..."\n"부모님이랑 자꾸 싸워요"'
              },
              {
                step: 2,
                title: '내가 기억을 떠올려볼게',
                description: `${elderCount}개의 인생 중에서\n비슷한 경험을 찾아볼게`
              },
              {
                step: 3,
                title: '내 경험을 나눠줄게',
                description: '"나도 그랬어. 그때 이렇게 했지..."\n실제 겪은 이야기로'
              }
            ].map((item, index) => (
              <ScrollAnimationWrapper key={index} animation="scale" delay={index * 200} duration={700}>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary-extra-light text-primary-dark flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm whitespace-pre-line">
                    {item.description}
                  </p>
                </div>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Difference Section */}
      <section className="py-20 bg-[#F8F8FB]">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollAnimationWrapper animation="fade-up" duration={800}>
            <h2 className="text-3xl font-bold text-center mb-12">뭐가 다른데?</h2>
          </ScrollAnimationWrapper>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Other AI */}
            <ScrollAnimationWrapper animation="fade-right" delay={0} duration={800}>
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h3 className="font-bold text-lg mb-4 text-gray-400">일반 AI</h3>
                <p className="text-gray-500 italic mb-4">
                  "실패는 성공의 어머니입니다.<br/>
                  긍정적으로 생각해보세요."
                </p>
                <p className="text-sm text-gray-400">
                  → 인터넷에서 본 말
                </p>
              </div>
            </ScrollAnimationWrapper>
            
            {/* Testype */}
            <ScrollAnimationWrapper animation="fade-left" delay={200} duration={800}>
              <div className="bg-[#FFF8F3] rounded-2xl p-8 border-2 border-primary-extra-light">
                <h3 className="font-bold text-lg mb-4 text-primary-dark">테스형</h3>
                <p className="text-text mb-4">
                  "야, 나도 사업 3번 망해봤어.<br/>
                  첫 번째 망했을 때 진짜 하늘이 무너지는 줄 알았지.<br/>
                  근데 지금 생각하면..."
                </p>
                <p className="text-sm text-primary">
                  → 직접 겪어본 이야기
                </p>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <ScrollAnimationWrapper animation="blur" duration={1000}>
        <section className="py-20 bg-[#F5F8F5]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <ScrollAnimationWrapper animation="fade-up" delay={200} duration={800}>
              <h2 className="text-3xl font-bold mb-8">왜 소크라테스냐고?</h2>
            </ScrollAnimationWrapper>
            
            <div className="space-y-6 text-lg text-text leading-relaxed">
              <ScrollAnimationWrapper animation="fade-up" delay={400} duration={800}>
                <p>
                  소크라테스가 뭘 했는지 알아?
                </p>
              </ScrollAnimationWrapper>
              
              <ScrollAnimationWrapper animation="fade-up" delay={600} duration={800}>
                <p>
                  길거리에서 사람들 붙잡고 대화했어.<br/>
                  "너 행복이 뭐라고 생각해?" "삶의 의미가 뭘까?"
                </p>
              </ScrollAnimationWrapper>
              
              <ScrollAnimationWrapper animation="fade-up" delay={800} duration={800}>
                <p>
                  나도 그래. 인생에 대해 얘기하고 싶어.<br/>
                  근데 나는 <strong>직접 살아본 경험</strong>으로 얘기해.
                </p>
              </ScrollAnimationWrapper>
              
              <ScrollAnimationWrapper animation="scale" delay={1000} duration={900}>
                <div className="bg-white rounded-3xl p-8 mt-8">
                  <p className="text-2xl font-bold text-text mb-2">
                    "검토되지 않은 삶은 살 가치가 없다"
                  </p>
                  <p className="text-base font-normal text-gray-500">- 소크라테스</p>
                </div>
              </ScrollAnimationWrapper>
            </div>
          </div>
        </section>
      </ScrollAnimationWrapper>

      {/* Email Signup Section */}
      <ScrollAnimationWrapper animation="fade-up" duration={800}>
        <section className="py-20 bg-white">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <ScrollAnimationWrapper animation="fade-up" delay={200} duration={800}>
              <h2 className="text-3xl font-bold mb-4">출시되면 알려줄게</h2>
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="fade-up" delay={400} duration={800}>
              <p className="text-gray-600 mb-8">
                아직 준비 중이야. 근데 곧 만날 수 있어.
              </p>
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="fade-up" delay={600} duration={800}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <input
                  type="email"
                  placeholder="이메일 주소"
                  className="px-6 py-4 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary-extra-light focus:border-primary w-full sm:w-80"
                />
                <button className="px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors">
                  알림 받기
                </button>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </section>
      </ScrollAnimationWrapper>

      {/* Transparency Note + CTA */}
      <ScrollAnimationWrapper animation="blur" duration={1000}>
        <section className="py-20 bg-gray-900 text-white">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <ScrollAnimationWrapper animation="fade" delay={200} duration={700}>
              <p className="text-gray-400 text-sm mb-8">
                * 테스형의 이야기는 삼활인이 직접 인터뷰한 {elderCount}명의 인터뷰 대상자들의 실제 경험을 기반으로 합니다.<br/>
                <span className="text-gray-500">
                  (공개된 활서 + 아직 미공개된 인터뷰 모두 포함)
                </span>
              </p>
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="fade-up" delay={400} duration={800}>
              <h2 className="text-3xl font-bold text-white mb-4">기다리는 동안</h2>
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="fade" delay={600} duration={700}>
              <p className="text-gray-400 mb-8">
                테스형의 지혜가 될 활서를 먼저 읽어봐.
              </p>
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="scale" delay={800} duration={800}>
              <Link 
                href="/hwalseo" 
                className="inline-block px-8 py-4 bg-white text-text rounded-xl font-semibold hover:bg-muted transition-colors"
              >
                활서 읽으러 가기 →
              </Link>
            </ScrollAnimationWrapper>
          </div>
        </section>
      </ScrollAnimationWrapper>

    </main>
  );
}