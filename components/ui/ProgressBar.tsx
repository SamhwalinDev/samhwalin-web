import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  value: number;           // 현재 값
  max: number;             // 목표 값
  showLabel?: boolean;     // 라벨 표시 여부
  label?: string;          // 라벨 텍스트
  size?: 'sm' | 'md' | 'lg';
  color?: 'accent' | 'primary';
  className?: string;
}

export function ProgressBar({
  value,
  max,
  showLabel = true,
  label = '목표 달성률',
  size = 'md',
  color = 'accent',
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const colors = {
    accent: 'bg-accent',
    primary: 'bg-primary',
  };

  const bgColors = {
    accent: 'bg-accent-extra-light',
    primary: 'bg-primary-extra-light',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-body-sm font-medium text-gray-700">{label}</span>
          <span className={cn('text-body-sm font-semibold', color === 'accent' ? 'text-accent' : 'text-primary')}>
            {percentage}%
          </span>
        </div>
      )}
      <div className={cn('w-full rounded-full overflow-hidden', bgColors[color], sizes[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-slow ease-out', colors[color])}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={`${label}: ${percentage}%`}
        />
      </div>
    </div>
  );
}
