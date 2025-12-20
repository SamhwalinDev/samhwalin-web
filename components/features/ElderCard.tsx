import Link from 'next/link';
import { ProxiedImage } from '@/components/ui';
import type { ElderCard as ElderCardType } from '@/types';

interface ElderCardProps {
  elder: ElderCardType;
}

export function ElderCard({ elder }: ElderCardProps) {
  const currentYear = new Date().getFullYear();
  const age = elder.birthYear ? currentYear - elder.birthYear : null;

  return (
    <Link href={`/elders/${elder.slug}`} className="group block">
      <article className="h-full flex flex-col bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
        {/* Photo - 3:4 portrait ratio to better show faces */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          {elder.photo ? (
            <ProxiedImage
              src={elder.photo}
              alt={elder.name}
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-6xl text-gray-300">
              {elder.gender === '여성' ? '👵' : '👴'}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4">
          {/* Name and Age */}
          <h3 className="text-h4 text-gray-900 mb-1">
            {elder.name}
            {age && (
              <span className="text-body-sm text-gray-500 font-normal ml-2">
                ({age}세)
              </span>
            )}
          </h3>

          {/* Region */}
          {elder.region && (
            <p className="text-small text-gray-500 mb-2">{elder.region}</p>
          )}

          {/* Introduction */}
          {elder.introduction && (
            <p className="text-body-sm text-gray-600 line-clamp-2 mb-3">
              {elder.introduction}
            </p>
          )}

          {/* Hwalseo count */}
          <p className="text-small text-primary mt-auto">
            활서 {elder.hwalseoCount}편
          </p>
        </div>
      </article>
    </Link>
  );
}
