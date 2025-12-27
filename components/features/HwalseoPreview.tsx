import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HwalseoCard } from './HwalseoCard';
import { Button } from '@/components/ui';
import type { HwalseoCard as HwalseoCardType } from '@/types';

interface HwalseoPreviewProps {
  hwalseoList: HwalseoCardType[];
}

export function HwalseoPreview({ hwalseoList }: HwalseoPreviewProps) {
  if (hwalseoList.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-body text-muted-foreground">아직 활서가 없습니다.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-h1 text-foreground">최신 활서</h2>
        <Link href="/hwalseo">
          <Button variant="ghost" size="sm" className="group">
            전체 보기
            <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hwalseoList.map((hwalseo) => (
          <HwalseoCard key={hwalseo.id} hwalseo={hwalseo} />
        ))}
      </div>
    </div>
  );
}