import { Container, Section } from '@/components/layout';
import { HeroSection, MissionSection, HwalseoPreview, DonationProgress, DonationForm } from '@/components/features';
import { getHwalseoList, getDonationStats } from '@/lib/notion';

export default async function HomePage() {
  const hwalseoList = await getHwalseoList();
  const donationStats = await getDonationStats();
  
  // 가장 최근 활서 (첫 번째 아이템)
  const latestHwalseo = hwalseoList.length > 0 ? hwalseoList[0] : null;

  return (
    <>
      {/* 히어로 섹션 */}
      <HeroSection latestHwalseo={latestHwalseo} />

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
  <Container size="narrow">
    <div className="max-w-md mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-h1 text-gray-900 mb-4">
          함께 만들어가요
        </h2>
        <p className="text-body-lg text-gray-600">
          여러분의 후원이 어르신들의 이야기를 세상에 전합니다.
        </p>
      </div>
      
      <DonationProgress 
        current={donationStats.current} 
        goal={donationStats.goal} 
        donorCount={donationStats.donorCount} 
      />
      
      <div className="mt-8">
        <DonationForm />
      </div>
    </div>
  </Container>
</Section>
    </>
  );
}