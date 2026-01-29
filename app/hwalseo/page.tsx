import { Metadata } from 'next';
import Link from 'next/link';
import { getHwalseoList } from '@/lib/notion';
import { ProxiedImage } from '@/components/ui';
import { formatDate, formatTitleParts } from '@/lib/utils';
import { AnimatedList } from '@/components/features/AnimatedList';
import DarkSubscribeSection from '@/components/features/DarkSubscribeSection';

export const revalidate = 60;

export const metadata: Metadata = {
  title: '활서 | 삼활인',
  description: '인터뷰 대상자들의 인생 이야기를 담은 기록입니다. 한 편 한 편에 담긴 지혜를 만나보세요.',
  openGraph: {
    title: '활서 | 삼활인',
    description: '인터뷰 대상자들의 인생 이야기를 담은 기록입니다. 한 편 한 편에 담긴 지혜를 만나보세요.',
    type: 'website',
  },
};

export default async function HwalseoListPage() {
  const hwalseoList = await getHwalseoList();

  return (
    <main className="min-h-screen">
      {/* Header - White */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              활서
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              인터뷰 대상자들의 인생 이야기를 담은 기록입니다.<br />
              한 편 한 편에 담긴 지혜를 만나보세요.
            </p>
          </div>
        </div>
      </section>

      {/* Stats - Subtle orange tint */}
      <section style={{ backgroundColor: '#FFF8F3' }}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <p className="text-sm text-gray-600">
            총 <span className="font-bold text-gray-900">{hwalseoList.length}편</span>의 활서
          </p>
        </div>
      </section>

      {/* Grid - White */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          {hwalseoList.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatedList pageKey="hwalseo-list">
                {hwalseoList.map((hwalseo) => (
                  <Link
                    key={hwalseo.id}
                    href={`/hwalseo/${hwalseo.slug}`}
                    className="block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100 group"
                  >
                    <div className="h-48 bg-gray-100 relative overflow-hidden">
                      {hwalseo.coverImage ? (
                        <ProxiedImage
                          src={hwalseo.coverImage}
                          alt={hwalseo.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50">
                          <span className="text-5xl opacity-50">📜</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <span className="text-primary text-sm font-semibold">
                        {hwalseo.theme && hwalseo.theme.length > 0 ? hwalseo.theme.join(' · ') : '활서'}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 mt-2 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {formatTitleParts(hwalseo.title).map((part, index) => (
                          <span key={index}>
                            {index > 0 && <br />}
                            {part}
                          </span>
                        ))}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{hwalseo.elderName}</span>
                        <span>{formatDate ? formatDate(hwalseo.publishedAt) : hwalseo.publishedAt}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </AnimatedList>
            </div>
          ) : (
            <div className="text-center py-20">
              <span className="text-6xl mb-6 block">📝</span>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                아직 활서가 없습니다
              </h3>
              <p className="text-gray-500">
                곧 인터뷰 대상자들의 이야기가 올라올 예정이에요.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA - Subscribe Section */}
      <DarkSubscribeSection source="활서페이지" />
    </main>
  );
}