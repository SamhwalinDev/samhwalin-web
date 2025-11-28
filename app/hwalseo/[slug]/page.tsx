import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { Container, Section } from '@/components/layout';
import { HwalseoCard, HwalseoCta } from '@/components/features';
import { getHwalseoBySlug, getRelatedHwalseos } from '@/lib/notion';
import { formatDate } from '@/lib/utils';

export const revalidate = 3600;

interface HwalseoDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: HwalseoDetailPageProps): Promise<Metadata> {
  const hwalseo = await getHwalseoBySlug(params.slug);
  
  if (!hwalseo) {
    return { title: '활서를 찾을 수 없습니다' };
  }

  return {
    title: hwalseo.title,
    description: hwalseo.excerpt,
    openGraph: {
      title: hwalseo.title,
      description: hwalseo.excerpt,
      images: hwalseo.coverImage ? [hwalseo.coverImage] : [],
    },
  };
}

function ContentRenderer({ content }: { content: string }) {
  const lines = content.split('\n');
  
  return (
    <>
      {lines.map((line, index) => {
        // 이미지
        if (line.includes('[IMG]')) {
          const urlMatch = line.match(/\[IMG\](.*?)\[\/IMG\]/);
          const captionMatch = line.match(/\[CAP\](.*?)\[\/CAP\]/);
          
          if (urlMatch && urlMatch[1]) {
            const url = urlMatch[1];
            const caption = captionMatch ? captionMatch[1] : '';
            
            return (
              <figure key={index} className="my-8">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={url}
                    alt={caption || '활서 이미지'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 680px"
                    loading="lazy"
                  />
                </div>
                {caption && (
                  <figcaption className="text-center text-caption text-gray-500 mt-2">
                    {caption}
                  </figcaption>
                )}
              </figure>
            );
          }
        }
        // 제목 (##)
        if (line.startsWith('## ')) {
          return (
            <h2 key={index} className="text-h1 text-gray-900 mt-12 mb-6">
              {line.replace('## ', '')}
            </h2>
          );
        }
        // 소제목 (###)
        if (line.startsWith('### ')) {
          return (
            <h3 key={index} className="text-h2 text-gray-900 mt-8 mb-4">
              {line.replace('### ', '')}
            </h3>
          );
        }
        // 인용문 (>)
        if (line.startsWith('> ')) {
          return (
            <blockquote key={index} className="border-l-4 border-primary pl-6 my-8 italic text-gray-600">
              {line.replace('> ', '')}
            </blockquote>
          );
        }
        // 구분선
        if (line === '---') {
          return <hr key={index} className="my-8 border-gray-200" />;
        }
        // 목록
        if (line.startsWith('• ')) {
          return (
            <li key={index} className="text-body-lg text-text leading-loose ml-4">
              {line.replace('• ', '')}
            </li>
          );
        }
        // 일반 문단
        if (line.trim()) {
          return (
            <p key={index} className="text-body-lg text-text leading-loose mb-6">
              {line}
            </p>
          );
        }
        return null;
      })}
    </>
  );
}

export default async function HwalseoDetailPage({ params }: HwalseoDetailPageProps) {
  const hwalseo = await getHwalseoBySlug(params.slug);

  if (!hwalseo) {
    notFound();
  }

  const relatedHwalseos = await getRelatedHwalseos(hwalseo.id, hwalseo.theme, 2);

  return (
    <>
      <Section spacing="sm" className="border-b border-gray-200">
        <Container>
          <Link
            href="/hwalseo"
            className="inline-flex items-center gap-2 text-body-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            활서 목록
          </Link>

          <div className="max-w-content">
            <span className="tag mb-3">{hwalseo.theme}</span>
            <h1 className="text-display text-gray-900 mb-4">
              {hwalseo.title}
            </h1>
            <p className="text-body-lg text-gray-600 mb-6">
              {hwalseo.elderName}{hwalseo.elderAge ? ` (${hwalseo.elderAge}세)` : ''}
            </p>
            <time className="text-caption text-gray-400">
              {formatDate(hwalseo.publishedAt)}
            </time>
          </div>
        </Container>
      </Section>

      {hwalseo.coverImage && (
        <Section spacing="sm" className="py-8">
          <Container>
            <div className="relative aspect-video max-w-content mx-auto rounded-xl overflow-hidden bg-gray-100">
              <Image
                src={hwalseo.coverImage}
                alt={hwalseo.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 680px"
                priority
              />
            </div>
          </Container>
        </Section>
      )}

      <Section spacing="default" className="pt-8">
        <Container size="content">
          <article className="prose prose-lg max-w-none">
            <ContentRenderer content={hwalseo.content} />
          </article>

          <HwalseoCta elderName={hwalseo.elderName} hwalseoSlug={hwalseo.slug} />
        </Container>
      </Section>

      {relatedHwalseos.length > 0 && (
        <Section background="gray" spacing="default">
          <Container>
            <h2 className="text-h1 text-gray-900 mb-8 text-center">
              다른 활서
            </h2>
            <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {relatedHwalseos.map((related) => (
                <HwalseoCard key={related.id} hwalseo={related} />
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}