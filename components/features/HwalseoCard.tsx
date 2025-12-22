import Link from 'next/link';
import Image from 'next/image';
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

interface HwalseoCardProps {
  hwalseo: HwalseoItem;
}

export function HwalseoCard({ hwalseo }: HwalseoCardProps) {
  const formattedDate = new Date(hwalseo.publishedAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/hwalseo/${hwalseo.slug}`} className="group block h-full">
      <article className="h-full flex flex-col bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
        {/* 이미지 */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={hwalseo.coverImage || '/images/placeholder.jpg'}
            alt={hwalseo.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
            loading="lazy"
          />
        </div>

        {/* 콘텐츠 */}
        <div className="flex flex-col flex-1 p-5">
          {/* 테마 */}
          <span className="text-small font-medium text-primary mb-2">
            {hwalseo.theme}
          </span>

          {/* 제목 - 고정 높이, 2줄 제한 */}
          <h3 className="text-h4 text-foreground mb-2 line-clamp-2 min-h-[3.5rem]">
            {formatTitleParts(hwalseo.title).map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </h3>

          {/* 어르신 이름 */}
          <p className="text-body-sm text-gray-700 mb-1">
            {hwalseo.elderName}
          </p>

          {/* 요약 - 고정 높이, 2줄 제한 */}
          <p className="text-body-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
            {hwalseo.excerpt}
          </p>

          {/* 날짜 - 하단 고정 */}
          <p className="text-small text-gray-400 mt-auto pt-3">
            {formattedDate}
          </p>
        </div>
      </article>
    </Link>
  );
}