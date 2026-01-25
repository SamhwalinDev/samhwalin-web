'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Extract headings from markdown content
    const regex = /^(#{2,3})\s+(.+)$/gm;
    const matches = [...content.matchAll(regex)];
    
    // Strip markdown formatting from heading text
    const stripMarkdown = (text: string) => {
      return text
        .replace(/\*\*/g, '')  // Remove **
        .replace(/__/g, '')    // Remove __
        .replace(/\/\//g, ' ') // Replace // with space
        .trim();
    };
    
    const items = matches.map((match, index) => ({
      id: `heading-${index}`,
      text: stripMarkdown(match[2]),
      level: match[1].length,
    }));
    
    setHeadings(items);
  }, [content]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -35% 0%' }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden lg:block sticky top-24 ml-8 w-64">
      <p className="text-sm font-semibold text-gray-900 mb-4">목차</p>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li key={heading.id}>
            <Link
              href={`#${heading.id}`}
              className={`block py-1 transition-colors ${
                heading.level === 3 ? 'pl-4' : ''
              } ${
                activeId === heading.id
                  ? 'text-orange-600 font-medium'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {heading.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}