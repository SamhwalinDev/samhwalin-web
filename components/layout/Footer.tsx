import Link from 'next/link';
import { Mail, Instagram, Youtube } from 'lucide-react';
import { NAV_LINKS } from '@/types';
import { EmailSubscribeForm } from '@/components/features/EmailSubscribeForm';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container-custom py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block">
              <span className="text-xl font-bold text-gray-900">삼활인</span>
            </Link>
            <p className="mt-4 text-body-sm text-gray-600 leading-relaxed">
              삼활인은 유한한 삶을 기억하며 주어진 삶을 사랑하고 매일의 활력을 되찾는 지역과 세대 간 네트워킹 문화를 만들어갑니다.
            </p>
            <p className="mt-4 text-caption text-primary font-medium">
              Making People Alive and Connected
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-body-sm font-semibold text-gray-900 mb-4">
              바로가기
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-body-sm font-semibold text-gray-900 mb-4">
              연락처
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:info@samhwalin.org"
                  className="flex items-center gap-2 text-body-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Mail size={16} />
                  <span>info@samhwalin.org</span>
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/samhwalin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-body-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Instagram size={16} />
                  <span>@samhwalin</span>
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com/@samhwalin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-body-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Youtube size={16} />
                  <span>삼활인</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="max-w-md mx-auto text-center">
            <h4 className="text-body font-semibold text-gray-900 mb-2">
              새로운 이야기를 받아보세요
            </h4>
            <p className="text-body-sm text-gray-600 mb-4">
              새로운 활서가 발행되면 이메일로 알려드릴게요.
            </p>
            <EmailSubscribeForm source="footer" />
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-small text-gray-500 text-center">
            © {currentYear} 삼활인. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
