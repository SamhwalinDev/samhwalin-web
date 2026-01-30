'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Search } from 'lucide-react';
import { Container } from './Container';
import { cn } from '@/lib/utils';
import { NAV_LINKS } from '@/types';

interface HeaderProps {
  variant?: 'default' | 'minimal';
}

export function Header({ variant = 'default' }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/samhwalin-logo.svg"
              alt="삼활인 로고"
              width={148}
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
                    'text-body-sm font-medium transition-colors flex items-center gap-1',
                    pathname === link.href
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {link.label}
                  {link.href === '/search' && <Search size={16} className="inline" />}
                </Link>
              ))}
              {/* 후원 기능 임시 비활성화
              <Link
                href="/support"
                className="ml-4 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-full font-semibold text-sm transition-all duration-200 flex items-center gap-1"
              >
                <span>💛</span>
                <span>후원하기</span>
              </Link>
              */}
            </nav>
          )}

          {/* Search & Mobile Menu */}
          {variant === 'default' && (
            <div className="flex items-center gap-2">
              {/* Search Icon (Mobile - links to search page) */}
              <Link 
                href="/search" 
                className="md:hidden p-2 text-gray-600 hover:text-primary hover:bg-primary-extra-light rounded-full transition-all duration-200"
                aria-label="해답 찾기"
                title="해답 찾기"
              >
                <Search size={20} />
              </Link>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 text-muted-foreground hover:text-foreground"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="메뉴 열기"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
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
                  'flex items-center gap-2 py-3 text-body font-medium transition-colors',
                  pathname === link.href
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.href === '/search' && <Search size={18} />}
                {link.label}
              </Link>
            ))}
            {/* 후원 기능 임시 비활성화
            <Link
              href="/support"
              className="block w-full px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold text-center transition-all duration-200 mt-4"
              onClick={() => setIsMenuOpen(false)}
            >
              💛 후원하기
            </Link>
            */}
          </nav>
        )}
      </Container>
    </header>
  );
}
