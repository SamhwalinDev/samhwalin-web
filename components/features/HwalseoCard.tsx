import Link from 'next/link';
import { ProxiedImage } from '@/components/ui';
import { formatDate, formatTitleParts } from '@/lib/utils';
import type { HwalseoCard as HwalseoCardType } from '@/types';

interface HwalseoCardProps {
  hwalseo: HwalseoCardType;
}

export function HwalseoCard({ hwalseo }: HwalseoCardProps) {
  return (
    <Link
      href={`/hwalseo/${hwalseo.slug}`}
      className="block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 group"
    >
      {/* Cover Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {hwalseo.coverImage ? (
          <ProxiedImage
            src={hwalseo.coverImage}
            alt={hwalseo.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <span className="text-5xl opacity-50">📜</span>
          </div>
        )}
      </div>
      
      {/* Card Content */}
      <div className="p-6">
        {/* Theme Tag */}
        {hwalseo.theme && hwalseo.theme.length > 0 && (
          <span className="inline-block text-primary text-sm font-semibold mb-2">
            {hwalseo.theme.join(' · ')}
          </span>
        )}

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {formatTitleParts(hwalseo.title).map((part, index) => (
            <span key={index}>
              {index > 0 && <br />}
              {part}
            </span>
          ))}
        </h3>
        
        {/* Excerpt */}
        {hwalseo.excerpt && (
          <p className="text-gray-500 text-sm mb-4 line-clamp-2">
            {hwalseo.excerpt}
          </p>
        )}
        
        {/* Meta */}
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span className="font-medium text-gray-600">
            {hwalseo.elderName}
          </span>
          <span>{formatDate(hwalseo.publishedAt)}</span>
        </div>
      </div>
    </Link>
  );
}