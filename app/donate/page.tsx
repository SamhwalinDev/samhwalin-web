import { Metadata } from 'next';
import { Container, Section } from '@/components/layout';
import { DonationProgress } from '@/components/ui/ProgressBar';
import { DonationForm, SocialProof } from '@/components/features';
import { getDonationStats, getHwalseoList } from '@/lib/notion';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: '후원하기',
  description: '삼활인의 활동을 후원해주세요. 여러분의 후원으로 더 많은 어르신들의 이야기를 기록할 수 있습니다.',
};

export default async function DonatePage() {
  const [donationStats, hwalseoList] = await Promise.all([
    getDonationStats(),
    getHwalseoList(),
  ]);

  return (
    <Section spacing="default">
      <Container>
        <div className="max-w-lg mx-auto">
          {/* Hero */}
          <div className="text-center mb-10">
            {/* 어르신 이미지 */}
            <div className="relative w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden bg-gray-100">
              <div className="absolute inset-0 flex items-center justify-center text-4xl">
                👴
              </div>
            </div>
            <h1 className="text-h1 text-gray-900 mb-4">
              어르신들의 이야기를<br />함께 기록해주세요
            </h1>
            <p className="text-body text-gray-600 mb-6">
              86세 강장환 할아버지는 6.25 전쟁을 직접 겪으셨습니다.
              할아버지의 이야기가 사라지기 전에 기록으로 남기고 싶습니다.
            </p>
            {/* Social Proof */}
            <SocialProof 
              donorCount={donationStats.thisMonthCount} 
              todayCount={donationStats.todayCount}
              hwalseoCount={hwalseoList.length}
              variant="inline" 
            />
          </div>

          {/* Progress */}
          <DonationProgress
            current={donationStats.current}
            goal={donationStats.goal}
            donorCount={donationStats.donorCount}
            className="mb-10"
          />

          {/* Form */}
          <DonationForm />
        </div>
      </Container>
    </Section>
  );
}