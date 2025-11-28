import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Heart, Users, BookOpen, Sparkles } from 'lucide-react';
import { Container, Section } from '@/components/layout';
import { Button } from '@/components/ui';
import { getHwalseoList } from '@/lib/notion';
export const revalidate = 300; // 5분마다 (자주 안 바뀌니까)
export const metadata: Metadata = {
  title: '어라이브 프로젝트 소개',
  description: '어라이브는 어르신들의 인생 이야기를 기록하고, 세대를 넘어 연결하는 프로젝트입니다.',
};

const values = [
  {
    icon: Heart,
    title: 'Remembering',
    description: '어르신들의 삶을 기억합니다',
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

const team = [
  {
    name: '강현서',
    role: '대표',
    description: '인터뷰 · 기획 · 글쓰기 · 조직 운영',
    emoji: '📝',
  },
  {
    name: '박주원',
    role: '개발/디자인',
    description: '디자인 · 개발 · BI/CI · 전략',
    emoji: '💻',
  },
  {
    name: '조혜정',
    role: '굿즈',
    description: '굿즈 기획 및 제작',
    emoji: '🎨',
  },
  {
    name: '윤희은',
    role: '영상',
    description: '영상 활서 제작',
    emoji: '🎬',
  },
  {
    name: '권민지',
    role: '마케팅',
    description: '마케팅 · 전략 · 회계',
    emoji: '📊',
  },
];

const philosophy = [
  {
    latin: 'Memento Mori',
    korean: '죽음을 기억하라',
    description: '죽음의 유한성을 기억할 때, 사람은 자신의 삶을 기록하려 하고, 기록을 통해 관계를 맺고, 다시 기억됩니다.',
  },
  {
    latin: 'Amor Fati',
    korean: '운명을 사랑하라',
    description: '죽음을 기억하면, 현재의 삶을 사랑할 수밖에 없습니다.',
  },
  {
    latin: 'Carpe Diem',
    korean: '오늘을 충만히 살아라',
    description: '사랑, 희망, 기쁨과 같은 가치에 집중할 때 인간은 활력을 회복합니다.',
  },
];

export default async function AboutPage() {
  const hwalseoList = await getHwalseoList();
  const latestHwalseo = hwalseoList.length > 0 ? hwalseoList[0] : null;
  const heroImage = latestHwalseo?.coverImage || '/images/hero-placeholder.jpg';

  return (
    <>
      {/* 히어로 섹션 */}
      <section className="relative min-h-[60vh] flex items-center">
        {/* 배경 이미지 */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt="어라이브 프로젝트"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <Container size="default" className="relative z-10">
          <div className="text-center">
            <span className="inline-block px-4 py-2 bg-primary text-white rounded-full text-body-sm font-medium mb-6">
            어라이브 프로젝트
            </span>
            <h1 className="text-display text-white mb-6">
              어르신의 삶이<br />
              우리의 이야기가 됩니다
            </h1>
            <p className="text-body-lg text-white/80 max-w-2xl mx-auto">
              어라이브는 어르신들의 인생 이야기를 기록하고,<br />
              세대를 넘어 연결하는 프로젝트입니다.
            </p>
          </div>
        </Container>
      </section>

      {/* 철학 섹션 */}
      <Section spacing="lg" className="bg-white">
        <Container size="default">
          <div className="text-center mb-12">
            <h2 className="text-h1 text-gray-900 mb-4">우리의 철학</h2>
            <p className="text-body-lg text-gray-600">
              활력 없는 삶은 죽음과 다를 바 없습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {philosophy.map((item, index) => (
              <div key={item.latin} className="relative h-full">
                <div className="bg-gray-50 rounded-xl p-6 text-center h-full flex flex-col">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-h4 flex-shrink-0">
                    {index + 1}
                  </div>
                  <h3 className="text-h3 text-gray-900 mb-1">{item.latin}</h3>
                  <p className="text-body-sm text-primary font-medium mb-3">{item.korean}</p>
                  <p className="text-body-sm text-gray-600 flex-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 활서란? 섹션 */}
      <Section spacing="lg" className="bg-gray-50">
        <Container size="default">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* 왼쪽: 텍스트 */}
            <div className="flex flex-col">
              <span className="text-primary font-medium text-body-sm mb-2 block">활서(活書)란?</span>
              <h2 className="text-h1 text-gray-900 mb-6">
                살아있는 책,<br />
                삶을 담은 기록
              </h2>
              <p className="text-body text-gray-600 mb-6">
                활서는 '살 활(活)'과 '책 서(書)'의 합성어입니다.
                어르신들의 생생한 삶의 이야기를 담은 기록물로,
                웹 콘텐츠, 영상, 실물 책자 등 다양한 형태로 제작됩니다.
              </p>
              <ul className="space-y-3 text-body text-gray-600 flex-1">
                <li className="flex items-start gap-3">
                  <span className="text-primary">✓</span>
                  <span>1~2시간의 깊은 인터뷰를 통해 이야기를 채록합니다</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary">✓</span>
                  <span>테마별로 정리하여 웹에서 누구나 읽을 수 있습니다</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary">✓</span>
                  <span>독자는 엽서를 통해 어르신께 마음을 전할 수 있습니다</span>
                </li>
              </ul>
            </div>

            {/* 오른쪽: 인용문 카드 */}
            <div className="flex">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex flex-col justify-center w-full">
                <div className="text-6xl mb-6 text-center">📖</div>
                <blockquote className="text-body-lg text-gray-700 italic text-center mb-4">
                  "내 이야기가 누군가에게 도움이 된다니,<br />
                  그것만으로도 살아온 보람이 있네."
                </blockquote>
                <p className="text-body-sm text-gray-500 text-center">
                  — 86세 강장환 할아버지
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 미션/비전 섹션 */}
      <Section spacing="lg" className="bg-white">
        <Container size="default">
          <div className="text-center mb-12">
            <h2 className="text-h1 text-gray-900 mb-4">우리가 만들어가는 것</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-primary text-white rounded-xl p-8 h-full flex flex-col justify-center">
              <span className="text-white/70 text-body-sm font-medium mb-2 block">Mission</span>
              <p className="text-h3">
                유한한 삶을 기억하며 주어진 삶을 사랑하고,
                매일의 활력을 되찾는 세대 간 네트워킹 문화를 만들어갑니다.
              </p>
            </div>
            <div className="bg-gray-900 text-white rounded-xl p-8 h-full flex flex-col justify-center">
              <span className="text-white/70 text-body-sm font-medium mb-2 block">Vision</span>
              <p className="text-h2 font-bold">
                Making People<br />
                Alive and Connected
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="p-6 bg-gray-50 rounded-xl text-center hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-extra-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon size={24} className="text-primary" />
                </div>
                <h3 className="text-h4 text-gray-900 mb-1">{value.title}</h3>
                <p className="text-body-sm text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 팀 소개 섹션 */}
      <Section spacing="lg" className="bg-gray-50">
        <Container size="default">
          <div className="text-center mb-12">
            <span className="text-primary font-medium text-body-sm mb-2 block">Team</span>
            <h2 className="text-h1 text-gray-900 mb-4">팀 삼활인</h2>
            <p className="text-body-lg text-gray-600">
              어르신들의 이야기를 기록하는 청년들입니다.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100 h-full flex flex-col"
              >
                <div className="text-4xl mb-4">{member.emoji}</div>
                <h3 className="text-h4 text-gray-900 mb-1">{member.name}</h3>
                <p className="text-body-sm text-primary font-medium mb-2">{member.role}</p>
                <p className="text-small text-gray-500 flex-1">{member.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA 섹션 */}
      <Section spacing="lg" className="bg-white">
        <Container size="narrow">
          <div className="text-center">
            <h2 className="text-h1 text-gray-900 mb-4">
              함께 해주세요
            </h2>
            <p className="text-body-lg text-gray-600 mb-8">
              어르신들의 이야기를 읽고, 마음을 전하고,<br />
              프로젝트에 함께 해주세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-xs mx-auto sm:max-w-none">
              <Link href="/hwalseo" className="w-full sm:w-40">
                <Button variant="primary" size="lg" className="w-full group">
                  활서 읽기
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/donate" className="w-full sm:w-40">
                <Button variant="cta" size="lg" className="w-full">
                  후원하기
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}