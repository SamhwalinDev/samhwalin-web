import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Container, Section } from '@/components/layout';
import { HwalseoCard } from '@/components/features';
import { ProxiedImage } from '@/components/ui';
import { getElderById, getHwalseoByElderId } from '@/lib/notion';
import { processNotionText } from '@/lib/utils';

export const revalidate = 60;

interface ElderDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: ElderDetailPageProps): Promise<Metadata> {
  // slug is the elder ID without dashes
  const elderId = params.slug.replace(
    /(.{8})(.{4})(.{4})(.{4})(.{12})/,
    '$1-$2-$3-$4-$5'
  );
  const elder = await getElderById(elderId);

  if (!elder) {
    return { title: '어르신을 찾을 수 없습니다' };
  }

  return {
    title: `${elder.name} | 어르신`,
    description: elder.introduction || `${elder.name}님의 이야기`,
    openGraph: {
      title: `${elder.name} | 삼활인`,
      description: elder.introduction || `${elder.name}님의 이야기`,
      images: elder.photo ? [elder.photo] : [],
    },
  };
}

export default async function ElderDetailPage({
  params,
}: ElderDetailPageProps) {
  // Convert slug back to UUID format
  const elderId = params.slug.replace(
    /(.{8})(.{4})(.{4})(.{4})(.{12})/,
    '$1-$2-$3-$4-$5'
  );

  const [elder, hwalseoList] = await Promise.all([
    getElderById(elderId),
    getHwalseoByElderId(elderId),
  ]);

  if (!elder) {
    notFound();
  }

  const currentYear = new Date().getFullYear();
  const age = elder.birthYear ? currentYear - elder.birthYear : null;

  return (
    <>
      {/* Back Navigation */}
      <Section spacing="sm" className="border-b border-border">
        <Container>
          <Link
            href="/elders"
            className="inline-flex items-center gap-2 text-body-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            어르신 목록
          </Link>
        </Container>
      </Section>

      {/* Elder Profile */}
      <Section spacing="lg">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12">
              {/* Photo */}
              <div className="relative w-48 h-48 md:w-56 md:h-56 mx-auto md:mx-0 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                {elder.photo ? (
                  <ProxiedImage
                    src={elder.photo}
                    alt={elder.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 192px, 224px"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-8xl text-gray-300">
                    {elder.gender === '여성' ? '👵' : '👴'}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 text-center md:text-left">
                {/* Name and Age on same line */}
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  <span className="whitespace-nowrap">{elder.name}</span>
                  {age && (
                    <span className="text-2xl md:text-3xl text-muted-foreground font-normal ml-2 whitespace-nowrap">
                      ({age}세)
                    </span>
                  )}
                </h1>

                {elder.region && (
                  <p className="text-lg text-muted-foreground mb-4">{elder.region}</p>
                )}

                {/* Introduction - as a styled quote */}
                {elder.introduction && (
                  <blockquote 
                    className="text-xl md:text-2xl text-text mb-6 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: `&ldquo;${processNotionText(elder.introduction)}&rdquo;` }}
                  />
                )}

                {/* Bio */}
                {elder.bio && (
                  <div className="text-base text-muted-foreground leading-relaxed space-y-2">
                    {elder.bio.split('\n').map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Hwalseo List */}
      <Section spacing="lg" background="gray">
        <Container>
          <h2 className="text-h1 text-foreground mb-8 text-center">
            {elder.name}님의 활서
          </h2>

          {hwalseoList.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {hwalseoList.map((hwalseo) => (
                <HwalseoCard key={hwalseo.id} hwalseo={hwalseo} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-body text-muted-foreground">
                아직 등록된 활서가 없습니다.
              </p>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
