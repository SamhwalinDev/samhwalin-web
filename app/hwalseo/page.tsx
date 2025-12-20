import { Suspense } from 'react';
import { Container, Section } from '@/components/layout';
import { HwalseoCard } from '@/components/features';
import { getHwalseoList, getHwalseoThemes } from '@/lib/notion';
import { HwalseoFilter } from '@/components/features/HwalseoFilter';

export const revalidate = 60;

export default async function HwalseoPage() {
  const [hwalseoList, themes] = await Promise.all([
    getHwalseoList(),
    getHwalseoThemes(),
  ]);

  return (
    <Section spacing="lg">
      <Container>
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-display text-gray-900 mb-4">활서</h1>
          <p className="text-body-lg text-gray-600">
            어르신들의 삶이 담긴 이야기를 만나보세요.
          </p>
        </div>

        {/* 필터 + 목록 */}
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hwalseoList.map((hwalseo) => (
              <HwalseoCard key={hwalseo.id} hwalseo={hwalseo} />
            ))}
          </div>
        }>
          <HwalseoFilter hwalseoList={hwalseoList} themes={themes} />
        </Suspense>
      </Container>
    </Section>
  );
}