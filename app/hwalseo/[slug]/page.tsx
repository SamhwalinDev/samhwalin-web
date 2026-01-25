import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Clock, Quote } from 'lucide-react';
import { LikeButton, QuestionForm } from '@/components/features';
import ScrollAnimationWrapper from '@/components/ui/ScrollAnimationWrapper';
import { getHwalseoBySlug } from '@/lib/notion';
import { formatDate, formatTitleFlat } from '@/lib/utils';

interface Props {
  params: { slug: string };
}

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const hwalseo = await getHwalseoBySlug(params.slug);
  
  if (!hwalseo) {
    return {
      title: '활서를 찾을 수 없습니다 | 삼활인',
      description: '요청하신 활서를 찾을 수 없습니다.',
    };
  }

  const flatTitle = formatTitleFlat(hwalseo.title);
  const ogImage = `/api/og?title=${encodeURIComponent(flatTitle)}&elderName=${encodeURIComponent(hwalseo.elderName)}`;

  return {
    title: `${flatTitle} | 삼활인`,
    description: hwalseo.excerpt,
    openGraph: {
      title: flatTitle,
      description: hwalseo.excerpt,
      type: 'article',
      publishedTime: hwalseo.publishedAt,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: flatTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: flatTitle,
      description: hwalseo.excerpt,
      images: [ogImage],
    },
  };
}

export default async function HwalseoDetailPage({ params }: Props) {
  const hwalseo = await getHwalseoBySlug(params.slug);
  
  if (!hwalseo) {
    notFound();
  }

  // 읽기 시간 계산 (없으면 본문 길이로 추정)
  const estimatedReadingTime = hwalseo.readingTime || Math.ceil(hwalseo.content.length / 1000);

  return (
    <main className="min-h-screen bg-gray-50">
      
      {/* 상단 네비게이션 */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link 
            href="/hwalseo" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>활서 목록</span>
          </Link>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-12">
        
        {/* ========== 1. HOOK (훅) ========== */}
        {/* 첫 문장으로 시선 잡기 */}
        <ScrollAnimationWrapper animation="fade" duration={1000}>
          <section className="mb-16">
            {hwalseo.hook && (
              <div className="bg-[#FFF8F3] rounded-3xl p-8 mb-8">
                <Quote className="w-8 h-8 text-orange-400 mb-4" />
                <p className="text-2xl md:text-3xl font-medium text-gray-900 leading-relaxed">
                  "{hwalseo.hook}"
                </p>
              </div>
            )}
            
            {/* 제목 & 메타 */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {hwalseo.title}
            </h1>
            
            {hwalseo.subtitle && (
              <p className="text-xl text-gray-600 mb-6">
                {hwalseo.subtitle}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="font-medium text-orange-600">{hwalseo.elderName}님의 이야기</span>
              {hwalseo.region && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {hwalseo.region}
                </span>
              )}
              {hwalseo.publishedAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(hwalseo.publishedAt)}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {estimatedReadingTime}분
              </span>
            </div>
          </section>
        </ScrollAnimationWrapper>

        {/* ========== 2. CONTEXT (맥락) ========== */}
        {/* 이 분은 어떤 삶을 살았는가 */}
        {hwalseo.bio && (
          <ScrollAnimationWrapper animation="fade-up" duration={800}>
            <section className="mb-16">
              <h2 className="text-sm font-semibold text-orange-600 uppercase tracking-wider mb-4">
                이 분의 삶
              </h2>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {hwalseo.bio}
                </p>
              </div>
            </section>
          </ScrollAnimationWrapper>
        )}

        {/* ========== 3. LESSON (가르침) ========== */}
        {/* 본문 - 핵심 이야기 */}
        <ScrollAnimationWrapper animation="fade-up" duration={800}>
          <section className="mb-16">
            <h2 className="text-sm font-semibold text-orange-600 uppercase tracking-wider mb-4">
              이야기
            </h2>
            <div 
              className="prose prose-lg max-w-none
                       prose-headings:font-bold prose-headings:text-gray-900
                       prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
                       prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline
                       prose-blockquote:border-l-4 prose-blockquote:border-l-orange-400 prose-blockquote:bg-orange-50
                       prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:my-8
                       prose-blockquote:not-italic prose-blockquote:text-gray-700 prose-blockquote:font-medium
                       prose-strong:text-gray-900 prose-strong:font-semibold
                       prose-ul:my-6 prose-ol:my-6
                       prose-li:text-gray-700 prose-li:leading-relaxed
                       prose-h1:text-2xl prose-h1:mb-6 prose-h1:mt-8
                       prose-h2:text-xl prose-h2:mb-4 prose-h2:mt-6
                       prose-h3:text-lg prose-h3:mb-3 prose-h3:mt-4"
              dangerouslySetInnerHTML={{ __html: hwalseo.content }}
            />
          </section>
        </ScrollAnimationWrapper>

        {/* ========== 4. KEY TAKEAWAY (핵심 교훈) ========== */}
        {hwalseo.keyTakeaway && (
          <ScrollAnimationWrapper animation="scale" duration={800}>
            <section className="mb-16">
              <div className="bg-gray-900 text-white rounded-3xl p-8 text-center">
                <p className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-4">
                  핵심 교훈
                </p>
                <p className="text-xl md:text-2xl font-medium leading-relaxed">
                  "{hwalseo.keyTakeaway}"
                </p>
                <p className="text-gray-400 mt-4">
                  — {hwalseo.elderName}
                </p>
              </div>
            </section>
          </ScrollAnimationWrapper>
        )}

        {/* ========== 5. BEHIND (뒷이야기) ========== */}
        {hwalseo.behind && (
          <ScrollAnimationWrapper animation="fade-up" duration={800}>
            <section className="mb-16">
              <h2 className="text-sm font-semibold text-orange-600 uppercase tracking-wider mb-4">
                인터뷰 뒷이야기
              </h2>
              <div className="bg-[#F5F8F5] rounded-2xl p-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {hwalseo.behind}
                </p>
              </div>
            </section>
          </ScrollAnimationWrapper>
        )}

        {/* ========== 6. TO READER (독자에게) ========== */}
        {hwalseo.toReader && (
          <ScrollAnimationWrapper animation="fade-up" duration={800}>
            <section className="mb-16">
              <h2 className="text-sm font-semibold text-orange-600 uppercase tracking-wider mb-4">
                {hwalseo.elderName}님이 당신에게
              </h2>
              <div className="border-2 border-orange-200 rounded-2xl p-6 bg-white">
                <p className="text-lg text-gray-800 leading-relaxed italic">
                  "{hwalseo.toReader}"
                </p>
              </div>
            </section>
          </ScrollAnimationWrapper>
        )}

        {/* ========== 좋아요 버튼 ========== */}
        <ScrollAnimationWrapper animation="fade" duration={800}>
          <div className="flex justify-center mb-16">
            <LikeButton 
              postId={hwalseo.id} 
              initialLikes={hwalseo.likes || 0} 
            />
          </div>
        </ScrollAnimationWrapper>

        {/* ========== 구분선 ========== */}
        <hr className="border-gray-200 mb-16" />

        {/* ========== 질문하기 ========== */}
        <ScrollAnimationWrapper animation="fade-up" duration={800}>
          <section className="mb-16">
            <QuestionForm 
              elderName={hwalseo.elderName}
              elderId={hwalseo.elderId}
              hwalseoId={hwalseo.id}
            />
          </section>
        </ScrollAnimationWrapper>

        {/* ========== 하단 네비게이션 ========== */}
        <ScrollAnimationWrapper animation="fade-up" duration={800}>
          <div className="pt-8 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <Link 
                href="/hwalseo" 
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>활서 목록으로</span>
              </Link>
              
              <div className="text-right text-sm text-gray-500">
                <p>이 활서가 도움이 되셨나요?</p>
                <p className="text-orange-600 font-medium mt-1">당신의 이야기도 들려주세요</p>
              </div>
            </div>
          </div>
        </ScrollAnimationWrapper>

      </article>
    </main>
  );
}