import { getPreviewHwalseoBySlug } from '@/lib/notion';
import { getProxiedImageUrl } from '@/lib/utils';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Eye, Lock } from 'lucide-react';
import { ProxiedImage } from '@/components/ui';

export const revalidate = 60;

interface Props {
  params: { slug: string };
}

/**
 * Process markdown content to HTML with proper formatting
 * - Convert // to <br>
 * - Convert markdown headings to HTML with IDs
 * - Process other markdown syntax
 */
function processContent(content: string): string {
  let headingIndex = 0;
  let processed = content
    .replace(/^### (.+)$/gm, (_, text) => {
      const id = `heading-${headingIndex++}`;
      return `<h4 id="${id}" class="text-xl font-bold mt-8 mb-3 scroll-mt-24">${text}</h4>`;
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
  processed = processed.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-orange-400 bg-orange-50 py-4 px-6 rounded-r-lg my-8 font-medium text-gray-700">$1</blockquote>');
  
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

export async function generateMetadata({ params }: Props) {
  const hwalseo = await getPreviewHwalseoBySlug(params.slug);
  
  if (!hwalseo) {
    return { title: '활서를 찾을 수 없습니다 | 삼활인' };
  }

  return {
    title: `[미리보기] ${hwalseo.title} | 삼활인`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function PreviewHwalseoPage({ params }: Props) {
  const hwalseo = await getPreviewHwalseoBySlug(params.slug);

  if (!hwalseo) {
    notFound();
  }

  // 콘텐츠 포맷팅 처리
  const formattedContent = processContent(hwalseo.content);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Preview Banner */}
      <div className="bg-gradient-to-r from-orange-400 to-amber-400 text-white">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              <span className="font-medium">🌿 후원자 미리보기</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Lock className="w-4 h-4" />
              <span>링크 공유 금지</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link 
            href="/hwalseo/preview" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            미리보기 목록
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      {hwalseo.coverImage && (
        <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
          <ProxiedImage
            src={hwalseo.coverImage}
            alt={hwalseo.title}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      )}

      {/* Content */}
      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-orange-100 text-orange-600 text-sm font-medium px-3 py-1 rounded-full">
              미리보기
            </span>
            {hwalseo.theme && (
              <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
                {hwalseo.theme}
              </span>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {hwalseo.title.split('//').map((part, i) => (
              <span key={i}>
                {part.trim()}
                {i < hwalseo.title.split('//').length - 1 && <br />}
              </span>
            ))}
          </h1>
          
          {hwalseo.subtitle && (
            <p className="text-xl text-gray-600 mb-6">
              {hwalseo.subtitle}
            </p>
          )}
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="font-medium text-gray-900">{hwalseo.elderName}</span>
            {hwalseo.region && <span>{hwalseo.region}</span>}
          </div>
        </header>

        {/* Body */}
        <div 
          className="prose prose-lg max-w-none
                   prose-headings:font-bold prose-headings:text-gray-900
                   prose-p:text-gray-700 prose-p:leading-relaxed
                   prose-a:text-orange-500 prose-a:no-underline hover:prose-a:underline
                   prose-blockquote:border-l-orange-400 prose-blockquote:bg-orange-50
                   prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg"
          dangerouslySetInnerHTML={{ __html: formattedContent }}
        />

        {/* Footer Notice */}
        <div className="mt-12 p-6 bg-orange-50 rounded-2xl border border-orange-200">
          <div className="flex items-start gap-4">
            <div className="text-2xl">🌿</div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">후원자 미리보기</h3>
              <p className="text-sm text-gray-600">
                이 활서는 아직 정식 발행 전입니다.<br />
                후원자님께 먼저 공개해드리는 특별한 콘텐츠예요.<br />
                링크를 다른 곳에 공유하지 말아주세요 🙏
              </p>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
