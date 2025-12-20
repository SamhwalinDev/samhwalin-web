import { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section } from '@/components/layout';
import { ElderCard } from '@/components/features';
import { getElderList } from '@/lib/notion';

export const revalidate = 60;

export const metadata: Metadata = {
  title: '어르신들',
  description: '삼활인이 만난 어르신들의 이야기를 소개합니다.',
};

interface EldersPageProps {
  searchParams: { region?: string };
}

export default async function EldersPage({ searchParams }: EldersPageProps) {
  const elders = await getElderList();
  const selectedRegion = searchParams.region || '전체';

  // Get unique regions
  const uniqueRegions = Array.from(
    new Set(elders.map((e) => e.region).filter(Boolean) as string[])
  );
  const regions = ['전체', ...uniqueRegions];

  // Filter elders by region
  const filteredElders =
    selectedRegion === '전체'
      ? elders
      : elders.filter((e) => e.region === selectedRegion);

  return (
    <Section spacing="lg">
      <Container>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-display text-gray-900 mb-4">어르신들</h1>
          <p className="text-body-lg text-gray-600">
            삼활인이 만난 어르신들의 이야기를 소개합니다.
          </p>
        </div>

        {/* Region Filter */}
        {regions.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {regions.map((region) => (
              <Link
                key={region}
                href={
                  region === '전체'
                    ? '/elders'
                    : `/elders?region=${encodeURIComponent(region)}`
                }
                className={`px-4 py-2 rounded-full text-body-sm transition-colors ${
                  selectedRegion === region
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {region}
              </Link>
            ))}
          </div>
        )}

        {/* Elder Grid */}
        {filteredElders.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredElders.map((elder) => (
              <ElderCard key={elder.id} elder={elder} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-body text-gray-500">
              {selectedRegion === '전체'
                ? '아직 등록된 어르신이 없습니다.'
                : `${selectedRegion} 지역에 등록된 어르신이 없습니다.`}
            </p>
          </div>
        )}

        {/* Results count */}
        {filteredElders.length > 0 && (
          <p className="text-center text-small text-gray-400 mt-8">
            {selectedRegion === '전체' ? '전체' : selectedRegion}{' '}
            {filteredElders.length}명
          </p>
        )}
      </Container>
    </Section>
  );
}
