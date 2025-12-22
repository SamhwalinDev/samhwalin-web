import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout';
import { Button } from '@/components/ui';
import { formatTitleParts } from '@/lib/utils';

interface HwalseoItem {
  id: string;
  slug: string;
  title: string;
  elderName: string;
  theme: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
}

interface HeroSectionProps {
  latestHwalseo: HwalseoItem | null;
}

export function HeroSection({ latestHwalseo }: HeroSectionProps) {
  const heroImage = latestHwalseo?.coverImage || '/images/hero-placeholder.jpg';
  const hwalseoLink = latestHwalseo ? `/hwalseo/${latestHwalseo.slug}` : '/hwalseo';

  return (
    <section className="relative min-h-[80vh] flex items-center">
      {/* 배경 이미지 */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage}
          alt={latestHwalseo ? `${latestHwalseo.elderName}님의 이야기` : '삼활인'}
          fill
          className="object-cover"
          priority
        />
        {/* 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      </div>

      {/* 콘텐츠 */}
      <Container className="relative z-10">
        <div className="max-w-2xl">
          {/* 최신 활서 태그 */}
          {latestHwalseo && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-body-sm text-white/90">
                최신 활서: {latestHwalseo.elderName}님의 이야기
              </span>
            </div>
          )}

          <h1 className="text-display-lg text-white mb-6 leading-tight">
            {latestHwalseo ? (
              formatTitleParts(latestHwalseo.title).map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && <br />}
                </span>
              ))
            ) : (
              <>
                어르신의 삶이<br />
                우리의 이야기가 됩니다
              </>
            )}
          </h1>

          <p className="text-body-lg text-white/80 mb-8 leading-relaxed">
            {latestHwalseo ? (
              latestHwalseo.excerpt
            ) : (
              <>
                삼활인은 어르신들의 인생 이야기를 기록하고,<br />
                세대를 넘어 연결하는 프로젝트입니다.
              </>
            )}
          </p>

          {/* CTA 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={hwalseoLink}>
              <Button variant="cta" size="lg" className="group">
                활서 읽기
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}