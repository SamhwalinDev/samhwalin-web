import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Quote } from 'lucide-react';
import { LikeButton, QuestionForm, ShareButton } from '@/components/features';
import QnAList from '@/components/features/QnAList';
import { getHwalseoBySlug } from '@/lib/notion';
import { formatDate, formatTitleFlat, processNotionText } from '@/lib/utils';
import { ProxiedImage } from '@/components/ui';
import TableOfContents from '@/components/features/TableOfContents';

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

/**
 * Process markdown content to HTML with proper formatting
 * - Convert // to <br>
 * - Convert markdown headings to HTML with IDs
 * - Process other markdown syntax
 */
function processContent(content: string): string {
  let headingIndex = 0;
  
  // First, process headings with IDs (must be done before other replacements)
  let processed = content
    .replace(/^### (.+)$/gm, (_, text) => {
      const id = `heading-${headingIndex++}`;
      return `<h3 id="${id}" class="text-xl font-bold mt-8 mb-4 scroll-mt-24">${text}</h3>`;
    })
    .replace(/^## (.+)$/gm, (_, text) => {
      const id = `heading-${headingIndex++}`;
      return `<h2 id="${id}" class="text-2xl font-bold mt-10 mb-4 scroll-mt-24">${text}</h2>`;
    })
    .replace(/^# (.+)$/gm, (_, text) => {
      const id = `heading-${headingIndex++}`;
      return `<h1 id="${id}" class="text-3xl font-bold mt-12 mb-6 scroll-mt-24">${text}</h1>`;
    });
  
  // Process blockquotes (before paragraph wrapping)
  processed = processed.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-primary bg-primary-extra-light py-4 px-6 rounded-r-lg my-8 font-medium text-text">$1</blockquote>');
  
  // Process images
  processed = processed.replace(/\[IMG\](.+?)\[\/IMG\](?:\[CAP\](.+?)\[\/CAP\])?/g, (_, url, caption) => {
    return `<figure class="my-8"><img src="${url}" alt="${caption || ''}" class="w-full rounded-lg" /><figcaption class="text-center text-sm text-gray-500 mt-2">${caption || ''}</figcaption></figure>`;
  });
  
  // Process list items
  processed = processed.replace(/^• (.+)$/gm, '<li class="ml-6 mb-2">$1</li>');
  
  // Process inline formatting
  processed = processed
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');
  
  // Convert // to <br>
  processed = processed.replace(/\/\//g, '<br>');
  
  // Wrap paragraphs (split by double newlines, but preserve HTML tags)
  const lines = processed.split('\n');
  const wrapped: string[] = [];
  let currentParagraph: string[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // If line is empty, close current paragraph
    if (!trimmed) {
      if (currentParagraph.length > 0) {
        wrapped.push(`<p class="mb-6 leading-relaxed">${currentParagraph.join(' ')}</p>`);
        currentParagraph = [];
      }
      continue;
    }
    
    // If line is already HTML tag (heading, blockquote, figure, list), close paragraph and add tag
    if (trimmed.match(/^<(h[1-6]|blockquote|figure|ul|ol|li)/)) {
      if (currentParagraph.length > 0) {
        wrapped.push(`<p class="mb-6 leading-relaxed">${currentParagraph.join(' ')}</p>`);
        currentParagraph = [];
      }
      wrapped.push(trimmed);
      continue;
    }
    
    // Regular text line - add to current paragraph
    currentParagraph.push(trimmed);
  }
  
  // Close any remaining paragraph
  if (currentParagraph.length > 0) {
    wrapped.push(`<p class="mb-6 leading-relaxed">${currentParagraph.join(' ')}</p>`);
  }
  
  return wrapped.join('\n');
}

export default async function HwalseoDetailPage({ params }: Props) {
  const hwalseo = await getHwalseoBySlug(params.slug);
  
  if (!hwalseo) {
    notFound();
  }

  // 콘텐츠 포맷팅 처리
  const formattedContent = processContent(hwalseo.content);

  return (
    <main className="min-h-screen bg-background">
      
      {/* 상단 네비게이션 */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link 
            href="/hwalseo" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-text transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>활서 목록</span>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex gap-8">
          {/* Main Content */}
          <article className="flex-1 max-w-3xl">
        
        {/* ========== 1. HOOK (훅) ========== */}
        {/* 첫 문장으로 시선 잡기 */}
        <section className="mb-16">
          {hwalseo.hook && (
            <div className="bg-[#FFF8F3] rounded-3xl p-8 mb-8">
              <Quote className="w-8 h-8 text-primary mb-4" />
              <p 
                className="text-2xl md:text-3xl font-medium text-text leading-relaxed"
                dangerouslySetInnerHTML={{ __html: `"${processNotionText(hwalseo.hook)}"` }}
              />
            </div>
          )}
          
          {/* 제목 & 메타 */}
          <h1 
            className="text-3xl md:text-4xl font-bold text-text mb-4 leading-tight"
            dangerouslySetInnerHTML={{ __html: processNotionText(hwalseo.title) }}
          />
          
          {hwalseo.subtitle && (
            <p className="text-xl text-gray-600 mb-6">
              {hwalseo.subtitle}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="font-medium text-primary-dark">{hwalseo.elderName}님의 이야기</span>
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
          </div>
        </section>

        {/* ========== 2. CONTEXT (맥락) ========== */}
        {/* 이 분은 어떤 삶을 살았는가 */}
        {hwalseo.bio && (
          <section className="mb-16">
            <h2 className="text-sm font-semibold text-primary-dark uppercase tracking-wider mb-4">
              이 분의 삶
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-text leading-relaxed whitespace-pre-line">
                {hwalseo.bio}
              </p>
            </div>
          </section>
        )}

        {/* ========== 3. LESSON (가르침) ========== */}
        {/* 본문 - 핵심 이야기 */}
        <section className="mb-16">
          <h2 className="text-sm font-semibold text-primary-dark uppercase tracking-wider mb-4">
            이야기
          </h2>
          <div 
            className="prose prose-lg max-w-none
                     prose-headings:font-bold prose-headings:text-text
                     prose-p:text-text prose-p:leading-relaxed prose-p:mb-6
                     prose-a:text-primary-dark prose-a:no-underline hover:prose-a:underline
                     prose-blockquote:border-l-4 prose-blockquote:border-l-primary prose-blockquote:bg-primary-extra-light
                     prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:my-8
                     prose-blockquote:not-italic prose-blockquote:text-text prose-blockquote:font-medium
                     prose-strong:text-text prose-strong:font-semibold
                     prose-ul:my-6 prose-ol:my-6
                     prose-li:text-text prose-li:leading-relaxed
                     prose-h1:text-2xl prose-h1:mb-6 prose-h1:mt-8
                     prose-h2:text-xl prose-h2:mb-4 prose-h2:mt-6
                     prose-h3:text-lg prose-h3:mb-3 prose-h3:mt-4"
            dangerouslySetInnerHTML={{ __html: formattedContent }}
          />
        </section>

        {/* ========== 4. KEY TAKEAWAY (핵심 교훈) ========== */}
        {hwalseo.keyTakeaway && (
          <section className="mb-16">
            <div className="bg-gray-900 text-white rounded-3xl p-8 text-center">
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
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
        )}

        {/* ========== 5. BEHIND (뒷이야기) ========== */}
        {hwalseo.behind && (
          <section className="mb-16">
            <h2 className="text-sm font-semibold text-primary-dark uppercase tracking-wider mb-4">
              인터뷰 뒷이야기
            </h2>
            <div className="bg-[#F5F8F5] rounded-2xl p-6">
              <p className="text-text leading-relaxed whitespace-pre-line">
                {hwalseo.behind}
              </p>
            </div>
          </section>
        )}

        {/* ========== 6. TO READER (독자에게) ========== */}
        {hwalseo.toReader && (
          <section className="mb-16">
            <h2 className="text-sm font-semibold text-primary-dark uppercase tracking-wider mb-4">
              {hwalseo.elderName}님이 당신에게
            </h2>
            <div className="border-2 border-primary-extra-light rounded-2xl p-6 bg-white">
              <p className="text-lg text-text leading-relaxed italic">
                "{hwalseo.toReader}"
              </p>
            </div>
          </section>
        )}

        {/* ========== 좋아요 & 공유 버튼 ========== */}
        <div className="flex justify-center gap-4 mb-16">
          <LikeButton 
            postId={hwalseo.id} 
            initialLikes={hwalseo.likes || 0} 
          />
          <ShareButton 
            title={hwalseo.title}
          />
        </div>

        {/* ========== 구분선 ========== */}
        <hr className="border-border mb-16" />

        {/* ========== Q&A Section ========== */}
        <section className="mb-16">
          <QnAList 
            hwalseoId={hwalseo.id} 
            elderName={hwalseo.elder?.name || hwalseo.elderName} 
          />
        </section>

        {/* ========== 질문하기 ========== */}
        <section className="mb-16">
          <QuestionForm 
            elderName={hwalseo.elder?.name || hwalseo.elderName}
            elderId={hwalseo.elder?.id || hwalseo.elderId}
            hwalseoId={hwalseo.id}
            hwalseoTitle={hwalseo.title}
          />
        </section>

        {/* ========== 하단 네비게이션 ========== */}
        <div className="pt-8 border-t border-border">
          <div className="flex justify-between items-center">
            <Link 
              href="/hwalseo" 
              className="flex items-center gap-2 text-muted-foreground hover:text-text transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>활서 목록으로</span>
            </Link>
            
            <div className="text-right text-sm text-gray-500">
              <p>이 활서가 도움이 되셨나요?</p>
              <a 
                href="mailto:info@samhwalin.org?subject=인터뷰 참여 문의"
                className="text-primary hover:text-primary-dark hover:underline cursor-pointer font-medium mt-1 inline-block"
              >
                당신의 이야기도 들려주세요 →
              </a>
            </div>
          </div>
        </div>

          </article>
          
          {/* Sidebar - Right */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              {/* Elder Profile Card - Above TOC */}
              {hwalseo.elder && (
                <div className="bg-[#FFF8F3] rounded-2xl p-6 mb-6">
                  {/* Photo */}
                  {hwalseo.elder.photo ? (
                    <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-white shadow-md">
                      <ProxiedImage 
                        src={hwalseo.elder.photo} 
                        alt={hwalseo.elder.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-white shadow-md bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-3xl">👤</span>
                    </div>
                  )}
                  
                  {/* Name & Birth Year */}
                  <h3 className="text-lg font-bold text-center text-text">
                    {hwalseo.elder.name}
                  </h3>
                  {hwalseo.elder.birthYear && (
                    <p className="text-sm text-gray-500 text-center mb-3">
                      {hwalseo.elder.birthYear}년생
                    </p>
                  )}
                  
                  {/* Region */}
                  {hwalseo.elder.region && (
                    <p className="text-sm text-primary-dark text-center mb-3">
                      📍 {hwalseo.elder.region}
                    </p>
                  )}
                  
                  {/* Introduction */}
                  {hwalseo.elder.introduction && (
                    <p className="text-sm text-gray-600 text-center leading-relaxed mb-4 break-keep">
                      {hwalseo.elder.introduction}
                    </p>
                  )}
                  
                  {/* Bio - Collapsible or truncated */}
                  {hwalseo.elder.bio && (
                    <div className="text-xs text-gray-500 leading-relaxed border-t border-primary-extra-light pt-4 mt-4">
                      <p className="whitespace-pre-line line-clamp-6">
                        {hwalseo.elder.bio}
                      </p>
                    </div>
                  )}
                  
                  {/* Link to full profile */}
                  <Link 
                    href={`/elders/${hwalseo.elder.slug}`}
                    className="block text-center text-primary text-sm mt-4 hover:underline font-medium"
                  >
                    프로필 더보기 →
                  </Link>
                </div>
              )}
              
              {/* TOC - Below Profile */}
              <TableOfContents content={hwalseo.content} />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}