import { cn } from '@/lib/utils';

interface SocialProofProps {
  donorCount?: number;
  todayCount?: number;
  hwalseoCount?: number;
  variant?: 'default' | 'inline';
  className?: string;
}

export function SocialProof({ 
  donorCount = 0, 
  todayCount = 0,
  hwalseoCount = 0,
  variant = 'default',
  className 
}: SocialProofProps) {
  
  if (variant === 'inline') {
    return (
      <div className={cn('flex justify-center gap-6 text-body-sm text-gray-500', className)}>
        {hwalseoCount > 0 && (
          <span>📖 기록된 이야기 <strong className="text-gray-900">{hwalseoCount}개</strong></span>
        )}
        {donorCount > 0 && (
          <span>💛 이번 달 후원자 <strong className="text-gray-900">{donorCount}명</strong></span>
        )}
        {todayCount > 0 && (
          <span>🔥 오늘 <strong className="text-gray-900">{todayCount}명</strong> 참여</span>
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex justify-center gap-12 py-8', className)}>
      <div className="text-center">
        <p className="text-display text-primary">{hwalseoCount}</p>
        <p className="text-body text-gray-600">기록된 이야기</p>
      </div>
      <div className="text-center">
        <p className="text-display text-primary">{donorCount}</p>
        <p className="text-body text-gray-600">후원자</p>
      </div>
    </div>
  );
}

// 인기 배지 컴포넌트
interface PopularBadgeProps {
  className?: string;
}

export function PopularBadge({ className }: PopularBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5',
        'text-xs font-medium',
        'bg-primary text-white rounded-full',
        className
      )}
    >
      인기
    </span>
  );
}