import Link from 'next/link';
import { Heart, Users, BookOpen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';

const values = [
  {
    icon: Heart,
    title: 'Remembering',
    description: '오랜 세월을 살아오신 분들의 삶을 기억합니다',
  },
  {
    icon: Users,
    title: 'Networking',
    description: '세대 간 연결을 만들어갑니다',
  },
  {
    icon: BookOpen,
    title: 'Archiving',
    description: '소중한 이야기를 기록합니다',
  },
  {
    icon: Sparkles,
    title: 'Enjoying',
    description: '함께하는 기쁨을 나눕니다',
  },
];

export function MissionSection() {
  return (
    <div className="text-center">
      <h2 className="text-h1 text-foreground mb-4">
        삼활인이 하는 일
      </h2>
      <p className="text-body-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
        유한한 삶을 기억하며, 주어진 삶을 사랑하고,<br />
        매일의 활력을 되찾는 문화를 만들어갑니다.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {values.map((value) => (
          <div
            key={value.title}
            className="p-6 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-primary-extra-light rounded-full flex items-center justify-center mx-auto mb-4">
              <value.icon size={24} className="text-primary" />
            </div>
            <h3 className="text-h4 text-foreground mb-2">{value.title}</h3>
            <p className="text-body-sm text-muted-foreground">{value.description}</p>
          </div>
        ))}
      </div>

      {/* 더 알아보기 버튼 */}
      <Link href="/about">
        <Button variant="secondary" size="lg">
          삼활인 더 알아보기
        </Button>
      </Link>
    </div>
  );
}