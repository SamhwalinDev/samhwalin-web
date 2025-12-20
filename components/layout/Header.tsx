'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Container } from './Container';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: '프로필', href: '/elders' },
  { label: '활서', href: '/hwalseo' },
  { label: '프로젝트 소개', href: '/about' },
  { label: '후원하기', href: '/donate' },
];

interface HeaderProps {
  variant?: 'default' | 'minimal';
}

export function Header({ variant = 'default' }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo-alive-header.png"
              alt="어라이브 로고"
              width={120}
              height={32}
              className="h-8 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          {variant === 'default' && (
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-body-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Mobile Menu Button */}
          {variant === 'default' && (
            <button
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="메뉴 열기"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>

        {/* Mobile Navigation */}
        {variant === 'default' && isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-100">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block py-3 text-body font-medium transition-colors',
                  pathname === link.href
                    ? 'text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </Container>
    </header>
  );
}
