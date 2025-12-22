import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/layout';

export const revalidate = 300;

export const metadata: Metadata = {
  title: '프로젝트 소개 | 삼활인',
  description:
    '삼활인은 어르신들의 인생 이야기를 기록하고, 세대를 넘어 연결하는 프로젝트입니다.',
};

const hwalseoSteps = [
  {
    icon: '🎤',
    step: 'STEP 1',
    title: '인터뷰',
    description: '어르신과 1:1 깊은 대화를 나눕니다',
  },
  {
    icon: '✍️',
    step: 'STEP 2',
    title: '기록',
    description: '이야기를 정성껏 글로 옮깁니다',
  },
  {
    icon: '📖',
    step: 'STEP 3',
    title: '발행',
    description: '웹과 책자로 발행합니다',
  },
  {
    icon: '💌',
    step: 'STEP 4',
    title: '연결',
    description: '독자가 엽서로 마음을 전합니다',
  },
];

const philosophy = [
  {
    number: '01',
    latin: 'Memento Mori',
    korean: '죽음을 기억하라',
    description:
      '죽음의 유한성을 기억할 때, 사람은 자신의 삶을 기록하려 하고, 기록을 통해 관계를 맺고, 다시 기억됩니다.',
  },
  {
    number: '02',
    latin: 'Amor Fati',
    korean: '운명을 사랑하라',
    description:
      '죽음을 기억하면, 현재의 삶을 사랑할 수밖에 없습니다. 지나온 모든 순간이 소중해집니다.',
  },
  {
    number: '03',
    latin: 'Carpe Diem',
    korean: '오늘을 살아라',
    description:
      '사랑, 희망, 기쁨과 같은 가치에 집중할 때 인간은 활력을 회복합니다.',
  },
];

const team = [
  {
    name: '강현서',
    role: '대표',
    description: '인터뷰 · 기획',
  },
  {
    name: '박주원',
    role: '개발',
    description: '디자인',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* 히어로 섹션 */}
      <section
        className="relative min-h-[90vh] flex items-center overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #111827 0%, #1f2937 50%, rgba(146,64,14,0.12) 100%)',
        }}
      >
        {/* Top right orange glow */}
        <div
          className="absolute top-0 right-0 w-[400px] h-[400px] md:w-[500px] md:h-[500px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"
          style={{ background: 'rgba(245, 158, 11, 0.15)', filter: 'blur(100px)' }}
        />
        {/* Bottom left glow */}
        <div
          className="absolute bottom-0 left-0 w-[280px] h-[280px] md:w-[350px] md:h-[350px] rounded-full translate-y-1/2 -translate-x-1/3 pointer-events-none"
          style={{ background: 'rgba(251, 191, 36, 0.08)', filter: 'blur(80px)' }}
        />

        <div className="relative z-10 w-full text-center px-6 py-20">
          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/images/logo-alive-about.png"
              alt="al'ive"
              width={180}
              height={60}
              className="mx-auto h-12 md:h-14 w-auto"
              priority
            />
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white mb-6 tracking-wide font-light">
            Arrive, Alive!{' '}
            <span className="text-primary">no longer Alone.</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-white/70 mb-12 font-light leading-relaxed">
            잊히지 않는 삶을 잇습니다.
            <br />
            이어지면 잊히지 않습니다.
          </p>

          {/* Divider */}
          <div className="w-16 h-px mx-auto mb-12 bg-white/30" />

          {/* Quote */}
          <blockquote className="text-sm md:text-base text-white/40 italic max-w-xl mx-auto leading-relaxed">
            &ldquo;Don&apos;t ask yourself what the world needs.
            <br />
            Ask yourself what makes you come alive, and go do that.
            <br />
            Because what the world needs is people who have come alive.&rdquo;
          </blockquote>
          <p className="text-xs text-white/25 mt-4">— Howard Thurman</p>

          {/* Button */}
          <Link
            href="/hwalseo"
            className="inline-block mt-12 px-8 py-4 bg-white text-foreground rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            활서 읽어보기 →
          </Link>
        </div>
      </section>

      {/* al'ive 프로젝트 섹션 */}
      <section className="bg-white py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-primary-extra-light text-primary-dark rounded-full text-sm font-medium mb-4">
              비영리 프로젝트
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              al&apos;ive 프로젝트
            </h2>
            <p className="text-muted-foreground">
              alive + arrive의 중의적 의미를 담았습니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <div className="bg-muted rounded-2xl p-8 text-center">
              <div className="w-12 h-12 bg-primary-extra-light rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">alive</h3>
              <p className="text-muted-foreground">
                살아있음을 기록합니다.
                <br />
                어르신들의 삶이 생생하게 남습니다.
              </p>
            </div>
            <div className="bg-muted rounded-2xl p-8 text-center">
              <div className="w-12 h-12 bg-primary-extra-light rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✉️</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">arrive</h3>
              <p className="text-muted-foreground">
                다음 세대에게 도착합니다.
                <br />
                이야기가 시간을 넘어 전해집니다.
              </p>
            </div>
          </div>

          {/* Vision/Mission */}
          <div className="border-t border-border pt-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-sm font-medium text-primary-dark mb-2">VISION</p>
                <p className="text-xl md:text-2xl font-medium text-foreground">
                  우리의 이웃 어른들께
                  <br />
                  활력을 선물합니다.
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-primary-dark mb-2">MISSION</p>
                <p className="text-xl md:text-2xl font-medium text-foreground">
                  인생의 황혼에 다다른 이들의 삶을 기록하여 공동체에 기억되게
                  합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 활서란? 섹션 */}
      <section className="bg-primary-extra-light py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              활서(活書)란?{' '}
              <span className="text-base text-muted-foreground font-normal">
                살 활(活) + 글 서(書)
              </span>
            </h2>
            <p className="text-muted-foreground">
              어르신들의 살아있는 이야기를 담은 기록입니다.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hwalseoSteps.map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-2xl p-6 text-center shadow-sm"
              >
                <div className="w-14 h-14 bg-primary-extra-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <p className="text-sm text-primary-dark font-medium mb-1">
                  {item.step}
                </p>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 우리의 철학 섹션 */}
      <section className="bg-gray-900 text-white py-20">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">
              우리의 철학
            </h2>
            <p className="text-gray-400">
              al&apos;ive 프로젝트가 믿는 세 가지 가치
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-0">
            {philosophy.map((item, index) => (
              <div key={item.latin}>
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 py-8">
                  <div className="md:w-1/3">
                    <p className="text-3xl font-bold text-primary mb-2">
                      {item.number}
                    </p>
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {item.latin}
                    </h3>
                    <p className="text-primary/70">{item.korean}</p>
                  </div>
                  <div className="md:w-2/3">
                    <p className="text-gray-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
                {index < philosophy.length - 1 && (
                  <div className="h-px bg-gray-800" />
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 운영팀 섹션 */}
      <section className="bg-white py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-primary-extra-light text-primary-dark rounded-full text-sm font-medium mb-4">
              운영팀
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              삼활인 三活人
            </h2>
            <p className="text-muted-foreground">세 가지 가치를 추구하는 사람들</p>
          </div>

          <div className="flex justify-center gap-6 mb-8">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-muted rounded-2xl p-6 text-center w-48"
              >
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-gray-400">👤</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-primary-dark font-medium mb-1">
                  {member.role}
                </p>
                <p className="text-sm text-muted-foreground">{member.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              disabled
              className="px-6 py-2 border border-gray-300 text-gray-400 rounded-lg cursor-not-allowed"
            >
              삼활인 더 알아보기
            </button>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section
        className="relative py-20 overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #111827 0%, #1f2937 50%, rgba(146,64,14,0.12) 100%)',
        }}
      >
        {/* Glow effects */}
        <div
          className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"
          style={{ background: 'rgba(245, 158, 11, 0.1)', filter: 'blur(80px)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-[200px] h-[200px] rounded-full translate-y-1/2 -translate-x-1/3 pointer-events-none"
          style={{ background: 'rgba(251, 191, 36, 0.06)', filter: 'blur(60px)' }}
        />

        <div className="relative z-10 max-w-xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            함께해 주세요
          </h2>
          <p className="text-gray-400 mb-8">
            어르신들의 이야기를 읽고, 프로젝트를 후원해 주세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/hwalseo"
              className="px-8 py-4 bg-white text-foreground rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              활서 읽으러 가기
            </Link>
            <Link
              href="/donate"
              className="px-8 py-4 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              후원하기
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
