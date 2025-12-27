import { Metadata } from 'next';
import { Suspense } from 'react';
import { Container, Section } from '@/components/layout';
import { ElderFilter } from '@/components/features';
import { getElderList } from '@/lib/notion';

export const revalidate = 60;

export const metadata: Metadata = {
  title: '어르신들',
  description: '삼활인이 만난 어르신들의 이야기를 소개합니다.',
};

export default async function EldersPage() {
  const elders = await getElderList();

  return (
    <Section spacing="lg">
      <Container>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-display text-foreground mb-4">어르신들</h1>
          <p className="text-body-lg text-muted-foreground">
            삼활인이 만난 어르신들의 이야기를 소개합니다.
          </p>
        </div>

        {/* Search and Elder Grid */}
        <Suspense fallback={<div className="text-center py-8">로딩 중...</div>}>
          <ElderFilter elders={elders} />
        </Suspense>
      </Container>
    </Section>
  );
}
