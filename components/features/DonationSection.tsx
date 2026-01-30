'use client';

import { useState, useEffect } from 'react';
import { Heart, Coffee, Utensils, Mic, Camera, BookOpen } from 'lucide-react';

interface Stats {
  elderCount: number;
  visitorCount: number;
}

const donationAmounts = [
  { amount: 5000, label: '어르신을 만나러\n갑니다', icon: Coffee },
  { amount: 10000, label: '따뜻한 식사를\n함께합니다', icon: Utensils },
  { amount: 30000, label: '한 분의 인터뷰가\n시작됩니다', icon: Mic },
  { amount: 50000, label: '평생의 증명사진을\n선물합니다', icon: Camera },
  { amount: 100000, label: '실물 활서 한 권이\n만들어집니다', icon: BookOpen },
];

console.log('donationAmounts:', donationAmounts);

export default function DonationSection() {
  const [stats, setStats] = useState<Stats>({ elderCount: 0, visitorCount: 0 });
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        if (data.success) {
          setStats({
            elderCount: data.elderCount,
            visitorCount: data.visitorCount,
          });
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  const handleDonate = () => {
    const amount = selectedAmount || parseInt(customAmount) || 0;
    if (amount < 1000) {
      alert('최소 후원 금액은 1,000원입니다.');
      return;
    }
    // 토스페이 또는 후원 페이지로 이동
    window.open(`/support?amount=${amount}`, '_blank');
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K+`;
    }
    return num.toString();
  };

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-primary-extra-light to-white">
      <div className="max-w-4xl mx-auto px-4">
        {/* Stats */}
        <div className="flex justify-center gap-8 md:gap-16 mb-10">
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-primary">
              {isLoading ? '-' : stats.elderCount}
            </p>
            <p className="text-gray-600 text-sm mt-1">명의 이야기</p>
          </div>
          <div className="w-px bg-gray-300" />
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-primary">
              {isLoading ? '-' : formatNumber(stats.visitorCount)}
            </p>
            <p className="text-gray-600 text-sm mt-1">명의 독자</p>
          </div>
        </div>

        {/* CTA Text */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-text mb-3">
            💛 다음 이야기를 함께 만들어주세요
          </h2>
          <p className="text-gray-600">
            여러분의 작은 후원이 잊힐 뻔한 삶을 기록으로 남깁니다
          </p>
        </div>

        {/* Donation Amount Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          {/* Preset Amounts */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-4">
            {donationAmounts.map(({ amount, label, icon: Icon }) => (
              <button
                key={amount}
                onClick={() => {
                  setSelectedAmount(amount);
                  setCustomAmount('');
                }}
                className={`p-3 md:p-4 rounded-xl border-2 transition-all duration-200 min-h-[120px] flex flex-col items-center justify-center ${
                  selectedAmount === amount
                    ? 'border-primary bg-primary-extra-light'
                    : 'border-border hover:border-primary-light'
                }`}
              >
                <Icon className={`w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-2 ${
                  selectedAmount === amount ? 'text-primary' : 'text-gray-400'
                }`} />
                <p className={`font-bold text-base md:text-lg ${
                  selectedAmount === amount ? 'text-primary' : 'text-text'
                }`}>
                  {amount.toLocaleString()}원
                </p>
                <p className="text-xs text-gray-500 mt-1 leading-tight whitespace-pre-line">{label}</p>
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                placeholder="직접 입력"
                className="w-full px-4 py-3 border-2 border-border rounded-xl focus:border-primary focus:outline-none transition-colors"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                원
              </span>
            </div>
          </div>

          {/* Donate Button */}
          <button
            onClick={handleDonate}
            className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Heart className="w-5 h-5" />
            일시 후원하기
          </button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">또는</span>
            </div>
          </div>

          {/* Monthly Donation Section */}
          <div className="bg-gradient-to-r from-primary-extra-light to-amber-50 rounded-2xl p-6 border-2 border-primary-extra-light">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary-extra-light rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-text">정기 후원</h3>
                <p className="text-sm text-gray-600">매월 함께해주시면 더 큰 힘이 됩니다</p>
              </div>
            </div>
            
            <ul className="space-y-2 mb-4 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                매월 자동으로 후원되어 편리해요
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                정기 후원자 전용 뉴스레터를 받아보세요
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                언제든 해지 가능해요
              </li>
            </ul>
            
            <a
              href="/support#monthly"
              className="block w-full bg-white hover:bg-primary-extra-light text-primary border-2 border-primary py-3 rounded-xl font-bold text-center transition-all duration-200"
            >
              정기 후원 시작하기 →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
