import Link from 'next/link';
import { Container, Section } from '@/components/layout';
import { HeroSection, MissionSection, HwalseoPreview, DonationProgress, DonationForm, SocialProof, EmailSubscribeForm } from '@/components/features';
import { ProxiedImage } from '@/components/ui';
import { getHwalseoList, getDonationStats, getElderList } from '@/lib/notion';

export const revalidate = 60;

export default async function HomePage() {
  const [hwalseoList, donationStats, elders] = await Promise.all([
    getHwalseoList(),
    getDonationStats(),
    getElderList(),
  ]);

  // 가장 최근 활서 (첫 번째 아이템)
  const latestHwalseo = hwalseoList.length > 0 ? hwalseoList[0] : null;

  // 대표 어르신 (사진이 있는 첫 번째, 없으면 그냥 첫 번째)
  const featuredElder = elders.find((e) => e.photo) || elders[0];

  return (
    <>
      {/* 히어로 섹션 */}
      <HeroSection latestHwalseo={latestHwalseo} />

      {/* 어르신 스포트라이트 */}
      {featuredElder && (
        <Section spacing="lg" background="gray">
          <Container>
            <div className="text-center mb-8">
              <h2 className="text-h1 text-gray-900 mb-2">어르신을 만나보세요</h2>
              <p className="text-body text-gray-600">
                삼활인이 기록한 어르신들의 이야기
              </p>
            </div>

            <Link
              href={`/elders/${featuredElder.slug}`}
              className="block max-w-2xl mx-auto bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Photo - object-top to show face */}
                <div className="relative w-full sm:w-48 h-48 sm:h-auto sm:aspect-[3/4] bg-gray-100 shrink-0">
                  {featuredElder.photo ? (
                    <ProxiedImage
                      src={featuredElder.photo}
                      alt={featuredElder.name}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 640px) 100vw, 192px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-6xl text-gray-300">
                      {featuredElder.gender === '여성' ? '👵' : '👴'}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-h2 text-gray-900">{featuredElder.name}</h3>
                    {featuredElder.region && (
                      <span className="text-body-sm text-gray-500">
                        · {featuredElder.region}
                      </span>
                    )}
                  </div>

                  {featuredElder.introduction && (
                    <p className="text-body text-gray-600 mb-4 line-clamp-2">
                      {featuredElder.introduction}
                    </p>
                  )}

                  <p className="text-body-sm text-primary">
                    활서 {featuredElder.hwalseoCount}편 →
                  </p>
                </div>
              </div>
            </Link>

            {/* Link to all elders */}
            {elders.length > 1 && (
              <div className="text-center mt-6">
                <Link
                  href="/elders"
                  className="text-body text-gray-500 hover:text-gray-900 transition-colors"
                >
                  모든 어르신 보기 ({elders.length}명) →
                </Link>
              </div>
            )}
          </Container>
        </Section>
      )}

      {/* 최신 활서 미리보기 */}
      <Section spacing="lg" className="bg-white">
        <Container>
          <HwalseoPreview hwalseoList={hwalseoList.slice(0, 3)} />
        </Container>
      </Section>

      {/* 미션 섹션 */}
      <Section spacing="lg" className="bg-gray-50">
        <Container>
          <MissionSection />
        </Container>
      </Section>

      {/* 후원 섹션 */}
      <Section spacing="lg" className="bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* 왼쪽: 후원 현황 카드 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 lg:p-8 flex flex-col">
              {/* 헤더 텍스트 */}
              <div className="mb-8">
                <h2 className="text-h2 text-gray-900 mb-3">
                  함께 만들어가요
                </h2>
                <p className="text-body text-gray-600">
                  여러분의 후원이 어르신들의
                  <br className="sm:hidden" />
                  {' '}이야기를 세상에 전합니다.
                </p>
              </div>

              {/* 프로그래스 - 세로 중앙 */}
              <div className="flex-1 flex flex-col justify-center">
                <DonationProgress
                  current={donationStats.current}
                  goal={donationStats.goal}
                  donorCount={donationStats.donorCount}
                />
              </div>

              {/* 소셜 프루프 - 하단 */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <SocialProof
                  hwalseoCount={hwalseoList.length}
                  donorCount={donationStats.donorCount}
                />
              </div>
            </div>

            {/* 오른쪽: 후원 폼 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 lg:p-8">
              <DonationForm />
            </div>
          </div>
        </Container>
      </Section>

      {/* 이메일 구독 섹션 */}
      <Section spacing="lg" className="bg-gradient-to-br from-primary/10 via-primary/5 to-white">
        <Container>
          <div className="max-w-xl mx-auto text-center">
            {/* 아이콘 배지 */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <span className="text-3xl">📬</span>
            </div>
            <h2 className="text-h1 text-gray-900 mb-3">
              새 활서가 올라오면 알려드릴까요?
            </h2>
            <p className="text-body text-gray-600 mb-8">
              이메일을 남겨주시면 새로운 어르신의 이야기가 올라올 때 알려드립니다.
            </p>
            <EmailSubscribeForm source="homepage" className="max-w-md mx-auto" />
            <p className="text-caption text-gray-400 mt-4">
              언제든 구독을 취소할 수 있습니다. 스팸 메일을 보내지 않습니다.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}