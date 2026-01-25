import { Metadata } from 'next';
import Link from 'next/link';
import { getElderList } from '@/lib/notion';
import { ProxiedImage } from '@/components/ui';
import DarkSubscribeSection from '@/components/features/DarkSubscribeSection';
import { AnimatedList } from '@/components/features/AnimatedList';

export const revalidate = 60;

export const metadata: Metadata = {
  title: '프로필 | 삼활인',
  description: '삼활인이 만난 인터뷰 대상자들의 이야기를 소개합니다.',
  openGraph: {
    title: '프로필 | 삼활인',
    description: '삼활인이 만난 인터뷰 대상자들의 이야기를 소개합니다.',
    type: 'website',
  },
};

export default async function EldersPage() {
  const elders = await getElderList();

  return (
    <main className="min-h-screen">
      {/* Header - White */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              프로필
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              삼활인이 만난 인터뷰 대상자들의 이야기를 소개합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Stats - Subtle green tint */}
      <section style={{ backgroundColor: '#F5F8F5' }}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <p className="text-sm text-gray-600">
            총 <span className="font-bold text-gray-900">{elders.length}명</span>의 인터뷰 대상자
          </p>
        </div>
      </section>

      {/* Grid - White */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          {elders.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {elders.map((elder) => (
                <Link
                  key={elder.id}
                  href={`/elders/${elder.slug}`}
                  className="block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100 group"
                >
                  <div className="h-64 bg-gray-100 relative overflow-hidden">
                    {elder.photo ? (
                      <ProxiedImage
                        src={elder.photo}
                        alt={elder.name}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50">
                        <span className="text-7xl opacity-50">
                          {elder.gender === '여성' ? '👵' : '👴'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                        {elder.name}
                      </h3>
                      {elder.birthYear && (
                        <span className="text-gray-500">
                          ({new Date().getFullYear() - elder.birthYear + 1}세)
                        </span>
                      )}
                    </div>
                    {elder.region && (
                      <p className="text-sm text-gray-500 mb-3">{elder.region}</p>
                    )}
                    {elder.introduction && (
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                        {elder.introduction}
                      </p>
                    )}
                    <span className="text-primary text-sm font-semibold">
                      활서 {elder.hwalseoCount || 0}편 →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <span className="text-6xl mb-6 block">👴</span>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                아직 등록된 프로필이 없습니다
              </h3>
              <p className="text-gray-500">
                곧 인터뷰 대상자들을 소개해드릴게요.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA - Subscribe Section */}
      <DarkSubscribeSection source="프로필페이지" />
    </main>
  );
}
