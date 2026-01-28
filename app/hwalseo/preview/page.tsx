import { getPreviewHwalseos } from '@/lib/notion';
import { getProxiedImageUrl } from '@/lib/utils';
import Link from 'next/link';
import { Eye, Lock, ArrowLeft } from 'lucide-react';
import { ProxiedImage } from '@/components/ui';

export const revalidate = 60; // Revalidate every minute for fresh preview content

export const metadata = {
  title: '미리보기 | 삼활인',
  robots: {
    index: false, // 검색엔진에 노출되지 않도록
    follow: false,
  },
};

export default async function PreviewPage() {
  const previewHwalseos = await getPreviewHwalseos();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-400 to-amber-400 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <Link 
            href="/hwalseo" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            활서 목록으로
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">🌿 후원자 미리보기</h1>
              <p className="text-white/80">정식 발행 전 후원자님께만 공개되는 활서입니다</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm bg-white/20 rounded-full px-4 py-2 w-fit">
            <Lock className="w-4 h-4" />
            <span>이 페이지는 후원자 전용입니다. 링크를 공유하지 말아주세요.</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {previewHwalseos.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              아직 미리보기 활서가 없습니다
            </h2>
            <p className="text-gray-500">
              새로운 활서가 준비되면 이곳에서 먼저 만나보실 수 있어요!
            </p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-8">
              {previewHwalseos.length}개의 활서가 발행을 기다리고 있습니다
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {previewHwalseos.map((hwalseo) => (
                <Link
                  key={hwalseo.id}
                  href={`/hwalseo/preview/${hwalseo.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {hwalseo.coverImage ? (
                      <ProxiedImage
                        src={hwalseo.coverImage}
                        alt={hwalseo.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                        <span className="text-4xl">📖</span>
                      </div>
                    )}
                    {/* Preview Badge */}
                    <div className="absolute top-3 left-3 bg-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                      미리보기
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">
                      {hwalseo.title.split('//').map((part, i) => (
                        <span key={i}>
                          {part.trim()}
                          {i < hwalseo.title.split('//').length - 1 && <br />}
                        </span>
                      ))}
                    </h3>
                    {hwalseo.subtitle && (
                      <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                        "{hwalseo.subtitle}"
                      </p>
                    )}
                    <p className="text-orange-500 text-sm font-medium">
                      {hwalseo.elderName}님의 이야기
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
