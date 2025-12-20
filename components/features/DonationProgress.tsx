interface DonationProgressProps {
  current: number;
  goal: number;
  donorCount: number;
}

export function DonationProgress({ current, goal, donorCount }: DonationProgressProps) {
  const percentage = Math.min((current / goal) * 100, 100);

  return (
    <div className="flex-1 flex flex-col justify-center">
      {/* 진행률 바 */}
      <div className="mb-6">
        <div className="flex justify-between text-body-sm text-gray-600 mb-2">
          <span>{current.toLocaleString()}원</span>
          <span>목표 {goal.toLocaleString()}원</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* 통계 */}
      <div className="flex justify-center gap-8 text-center">
        <div>
          <p className="text-h3 text-gray-900">{donorCount}명</p>
          <p className="text-body-sm text-gray-500">후원자</p>
        </div>
        <div>
          <p className="text-h3 text-primary">{percentage.toFixed(0)}%</p>
          <p className="text-body-sm text-gray-500">달성</p>
        </div>
      </div>
    </div>
  );
}