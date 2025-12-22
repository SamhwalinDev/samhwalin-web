import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { Container, Section } from '@/components/layout';
import { HwalseoCard, HwalseoCta, MobileTableOfContents } from '@/components/features';
import { ProxiedImage } from '@/components/ui';
import { getHwalseoBySlug, getRelatedHwalseos, getElderByName } from '@/lib/notion';
import { formatDate } from '@/lib/utils';
import type { Elder } from '@/types';

/**
 * Parse inline markdown formatting and custom tags to React elements
 * Handles: **bold**, *italic*, `code`, ~~strikethrough~~, <u>underline</u>,
 * [links](url), [COLOR:name]text[/COLOR], [HIGHLIGHT:name]text[/HIGHLIGHT]
 */
function parseInlineFormatting(text: string): React.ReactNode {
  const processMarkdown = (str: string): string => {
    let result = str;

    // Bold: **text**
    result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Italic: *text* (not preceded by *)
    result = result.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');

    // Code: `text`
    result = result.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');

    // Strikethrough: ~~text~~
    result = result.replace(/~~(.+?)~~/g, '<del>$1</del>');

    // Underline: <u>text</u> - already HTML, just keep it

    // Links: [text](url)
    result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');

    // Color: [COLOR:name]text[/COLOR]
    result = result.replace(/\[COLOR:(\w+)\](.+?)\[\/COLOR\]/g, '<span style="color: var(--notion-$1)">$2</span>');

    // Highlight: [HIGHLIGHT:name]text[/HIGHLIGHT]
    result = result.replace(/\[HIGHLIGHT:(\w+)\](.+?)\[\/HIGHLIGHT\]/g, '<mark style="background-color: var(--notion-$1-bg); padding: 0.125rem 0.25rem; border-radius: 0.125rem;">$2</mark>');

    return result;
  };

  const processedHtml = processMarkdown(text);

  // If no formatting was applied, return plain text
  if (processedHtml === text) {
    return text;
  }

  // Return as HTML
  return <span dangerouslySetInnerHTML={{ __html: processedHtml }} />;
}

export const revalidate = 3600;

interface HwalseoDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: HwalseoDetailPageProps): Promise<Metadata> {
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
                  <figcaption className="text-center text-caption text-muted-foreground mt-2">
                    {parseInlineFormatting(caption)}
                  </figcaption>
                )}
              </figure>
            );
          }
        }
        // 대제목 (#) - Notion heading_1
        if (line.startsWith('# ') && !line.startsWith('## ')) {
          const text = line.replace('# ', '');
          return (
            <h2
              key={index}
              id={`heading-${index}`}
              className="text-article-h1 text-foreground mt-12 mb-6 scroll-mt-24 break-keep"
            >
              {parseInlineFormatting(text)}
            </h2>
          );
        }
        // 제목 (##) - Notion heading_2
        if (line.startsWith('## ')) {
          const text = line.replace('## ', '');
          return (
            <h3
              key={index}
              id={`heading-${index}`}
              className="text-article-h2 text-foreground mt-10 mb-5 scroll-mt-24 break-keep"
            >
              {parseInlineFormatting(text)}
            </h3>
          );
        }
        // 소제목 (###) - Notion heading_3
        if (line.startsWith('### ')) {
          const text = line.replace('### ', '');
          return (
            <h4
              key={index}
              id={`heading-${index}`}
              className="text-article-h3 text-foreground mt-8 mb-4 scroll-mt-24 break-keep"
            >
              {parseInlineFormatting(text)}
            </h4>
          );
        }
        // 인용문 (>)
        if (line.startsWith('> ')) {
          return (
            <blockquote
              key={index}
              className="border-l-4 border-primary pl-6 my-8 italic text-muted-foreground"
            >
              {parseInlineFormatting(line.replace('> ', ''))}
            </blockquote>
          );
        }
        // 구분선
        if (line === '---') {
          return <hr key={index} className="my-8 border-border" />;
        }
        // 목록
        if (line.startsWith('• ')) {
          return (
            <li key={index} className="text-body-lg text-text leading-loose ml-4">
              {parseInlineFormatting(line.replace('• ', ''))}
            </li>
          );
        }
        // 일반 문단
        if (line.trim()) {
          return (
            <p key={index} className="text-body-lg text-text leading-loose mb-6">
              {parseInlineFormatting(line)}
            </p>
          );
        }
        return null;
      })}
    </>
  );
}

interface Heading {
  level: number;
  text: string;
  lineIndex: number;
}

function extractHeadings(content: string): Heading[] {
  const lines = content.split('\n');

  return lines
    .map((line, index) => {
      if (line.startsWith('# ') && !line.startsWith('## ')) {
        return { level: 1, text: line.replace('# ', ''), lineIndex: index };
      }
      if (line.startsWith('## ')) {
        return { level: 2, text: line.replace('## ', ''), lineIndex: index };
      }
      if (line.startsWith('### ')) {
        return { level: 3, text: line.replace('### ', ''), lineIndex: index };
      }
      return null;
    })
    .filter((h): h is Heading => h !== null);
}

function DesktopTableOfContents({ content }: { content: string }) {
  const headings = extractHeadings(content);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden xl:block w-56 shrink-0">
      <div className="sticky top-24">
        <h4 className="text-sm font-semibold text-foreground mb-4">목차</h4>
        <ul className="space-y-0.5 text-sm">
          {headings.map((heading, idx) => {
            const isH1 = heading.level === 1;
            const isH2 = heading.level === 2;
            const isH3 = heading.level === 3;
            const isFirstH1 = isH1 && headings.findIndex((h) => h.level === 1) === idx;

            return (
              <li
                key={idx}
                className={`
                  ${isH1 && !isFirstH1 ? 'mt-4 pt-3 border-t border-gray-100' : ''}
                  ${isH3 ? 'ml-4' : ''}
                `}
              >
                <a
                  href={`#heading-${heading.lineIndex}`}
                  className={`
                    block py-1.5 transition-colors line-clamp-2 break-keep
                    ${isH1 ? 'font-bold text-foreground hover:text-primary text-[15px]' : ''}
                    ${isH2 ? 'font-medium text-muted-foreground hover:text-primary pl-3 border-l-2 border-border hover:border-primary text-[14px]' : ''}
                    ${isH3 ? 'text-muted-foreground hover:text-foreground text-[13px] pl-3' : ''}
                  `}
                >
                  {isH1 && <span className="text-primary mr-2">■</span>}
                  {isH2 && <span className="text-gray-400 mr-1.5">›</span>}
                  {isH3 && <span className="text-gray-300 mr-1.5">–</span>}
                  {heading.text}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

function ElderProfile({
  elderName,
  elder,
}: {
  elderName: string;
  elder: Elder | null;
}) {
  const linkHref = elder
    ? `/elders/${elder.slug}`
    : `/hwalseo?elder=${encodeURIComponent(elderName)}`;

  const currentYear = new Date().getFullYear();
  const age = elder?.birthYear ? currentYear - elder.birthYear : null;

  return (
    <Link href={linkHref} className="xl:hidden block">
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 p-6 bg-muted rounded-xl mb-10 hover:bg-gray-100 transition-colors">
        {/* 어르신 사진 */}
        {elder?.photo ? (
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto sm:mx-0 rounded-xl overflow-hidden bg-gray-200 shrink-0">
            <ProxiedImage
              src={elder.photo}
              alt={elder.name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto sm:mx-0 rounded-xl bg-gray-200 flex items-center justify-center text-5xl shrink-0">
            {elder?.gender === '여성' ? '👵' : '👴'}
          </div>
        )}

        {/* 약력 */}
        <div className="flex-1">
          <h3 className="text-h2 text-foreground mb-1 text-center sm:text-left break-keep">
            {elder?.name || elderName}
          </h3>
          {age && (
            <p className="text-body-sm text-muted-foreground mb-4 text-center sm:text-left">
              {elder?.birthYear}년생 ({age}세)
            </p>
          )}
          {elder?.introduction && (
            <p className="text-body text-gray-700 mb-3 break-keep">
              &ldquo;{elder.introduction}&rdquo;
            </p>
          )}
          {elder?.bio && (
            <div className="space-y-1">
              {elder.bio
                .split('\n')
                .slice(0, 3)
                .map((line, idx) => (
                  <p key={idx} className="text-body-sm text-muted-foreground break-keep">
                    {line}
                  </p>
                ))}
            </div>
          )}
          <p className="text-small text-primary mt-4 text-center sm:text-left">
            {elder ? '프로필 보기 →' : '모든 활서 보기 →'}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default async function HwalseoDetailPage({
  params,
}: HwalseoDetailPageProps) {
  const hwalseo = await getHwalseoBySlug(params.slug);

  if (!hwalseo) {
    notFound();
  }

  // Fetch elder and related hwalseos in parallel
  const [elder, relatedHwalseos] = await Promise.all([
    getElderByName(hwalseo.elderName),
    getRelatedHwalseos(hwalseo.id, hwalseo.theme, 2),
  ]);

  return (
    <>
      <Section spacing="sm" className="border-b border-border">
        <Container>
          <Link
            href="/hwalseo"
            className="inline-flex items-center gap-2 text-body-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            활서 목록
          </Link>

          <div className="max-w-content">
            <span className="tag mb-3">{hwalseo.theme}</span>
            <h1 className="text-display text-foreground mb-4">{hwalseo.title}</h1>
            <p className="text-body-lg text-muted-foreground mb-6">
              {hwalseo.elderName}
              {hwalseo.elderAge ? ` (${hwalseo.elderAge}세)` : ''}
            </p>
            <time className="text-caption text-gray-400">
              {formatDate(hwalseo.publishedAt)}
            </time>
          </div>
        </Container>
      </Section>

      <Section spacing="default" className="pt-8">
        <Container>
          <div className="flex gap-8 justify-center">
            {/* 왼쪽 - 어르신 정보 카드 (데스크톱) */}
            <aside className="hidden xl:block w-56 shrink-0">
              <div className="sticky top-24">
                {elder ? (
                  <Link
                    href={`/elders/${elder.slug}`}
                    className="block bg-white border border-border shadow-sm rounded-xl p-5 hover:shadow-md hover:border-gray-300 transition-all"
                  >
                    {/* 프로필 사진 */}
                    {elder.photo ? (
                      <div className="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                        <ProxiedImage
                          src={elder.photo}
                          alt={elder.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center text-3xl">
                        {elder.gender === '여성' ? '👵' : '👴'}
                      </div>
                    )}
                    <h4 className="text-h3 text-foreground text-center mb-1 break-keep">
                      {elder.name}
                    </h4>
                    {elder.birthYear && (
                      <p className="text-caption text-muted-foreground text-center mb-3">
                        {elder.birthYear}년생
                      </p>
                    )}
                    {/* 약력 */}
                    {elder.bio && (
                      <div className="text-small text-muted-foreground text-left mb-3 space-y-1 border-t border-gray-100 pt-3">
                        {elder.bio
                          .split('\n')
                          .slice(0, 3)
                          .map((line, idx) => (
                            <p key={idx} className="break-keep line-clamp-1">
                              {line}
                            </p>
                          ))}
                      </div>
                    )}
                    <p className="text-small text-primary text-center mt-3">
                      프로필 보기 →
                    </p>
                  </Link>
                ) : (
                  <Link
                    href={`/hwalseo?elder=${encodeURIComponent(hwalseo.elderName)}`}
                    className="block bg-white border border-border shadow-sm rounded-xl p-5 hover:shadow-md hover:border-gray-300 transition-all"
                  >
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center text-3xl">
                      👴
                    </div>
                    <h4 className="text-h3 text-foreground text-center mb-1 break-keep">
                      {hwalseo.elderName}
                    </h4>
                    <p className="text-small text-gray-400 text-center mt-3">
                      모든 활서 보기 →
                    </p>
                  </Link>
                )}
              </div>
            </aside>

            {/* 중앙 - 본문 */}
            <div className="flex-1 max-w-content min-w-0">
              {/* 모바일 어르신 프로필 */}
              <ElderProfile elderName={hwalseo.elderName} elder={elder} />

              <article className="prose prose-lg max-w-none">
                <ContentRenderer content={hwalseo.content} />
              </article>

              <HwalseoCta elderName={hwalseo.elderName} hwalseoSlug={hwalseo.slug} />
            </div>

            {/* 오른쪽 - 목차 (데스크톱) */}
            <DesktopTableOfContents content={hwalseo.content} />
          </div>
        </Container>
      </Section>

      {relatedHwalseos.length > 0 && (
        <Section background="gray" spacing="default">
          <Container>
            <h2 className="text-h1 text-foreground mb-8 text-center">다른 활서</h2>
            <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {relatedHwalseos.map((related) => (
                <HwalseoCard key={related.id} hwalseo={related} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Mobile Table of Contents - only visible on < xl screens */}
      <MobileTableOfContents content={hwalseo.content} />
    </>
  );
}
