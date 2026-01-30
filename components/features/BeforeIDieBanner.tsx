'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Quote } from 'lucide-react';
import { processNotionText } from '@/lib/utils';

interface Elder {
  id: string;
  name: string;
  slug: string;
  region?: string;
  birthYear?: number | null;
  quote?: string;  // Optional to match main Elder type
}

interface BeforeIDieBannerProps {
  elders: Elder[];
}

const getFirstName = (fullName: string): string => {
  if (!fullName) return '';
  if (fullName.length === 3) return fullName.slice(1);
  if (fullName.length === 2) return fullName.slice(1);
  if (fullName.length >= 4) return fullName.slice(2);
  return fullName;
};

const getAge = (birthYear: number | null | undefined): number | null => {
  if (!birthYear) return null;
  return new Date().getFullYear() - birthYear + 1;
};

export default function BeforeIDieBanner({ elders }: BeforeIDieBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!elders || elders.length <= 1) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % elders.length);
        setIsVisible(true);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [elders?.length]);

  if (!elders || elders.length === 0) {
    return null;
  }

  const currentElder = elders[currentIndex];
  const firstName = getFirstName(currentElder.name);
  const age = getAge(currentElder.birthYear);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-primary-extra-light via-amber-50 to-primary-extra-light rounded-3xl p-8 md:p-10 shadow-lg border border-primary-extra-light/50">
        <Link 
          href={`/elders/${currentElder.slug}`}
          className="block group"
        >
          <div className="flex items-start gap-5">
            {/* Quote Icon */}
            <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-primary/20 rounded-2xl flex items-center justify-center group-hover:bg-primary/30 transition-colors">
              <Quote className="w-6 h-6 md:w-7 md:h-7 text-primary" />
            </div>
            
            {/* Content */}
            <div className={`flex-1 min-w-0 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              <p 
                className="text-xl md:text-2xl lg:text-3xl font-bold text-text mb-4 leading-snug group-hover:text-primary transition-colors"
                dangerouslySetInnerHTML={{ __html: `"${processNotionText(currentElder.quote)}"` }}
              />
              <p className="text-base md:text-lg text-gray-600">
                — {firstName}
                {age && <span className="text-gray-400"> ({age}세)</span>}
                {currentElder.region && <span className="text-gray-400">, {currentElder.region}</span>}
              </p>
            </div>
          </div>
        </Link>
        
        {/* Indicators */}
        {elders.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {elders.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  setIsVisible(false);
                  setTimeout(() => {
                    setCurrentIndex(index);
                    setIsVisible(true);
                  }, 300);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-primary w-8' 
                    : 'bg-primary/30 w-2 hover:bg-primary/50'
                }`}
                aria-label={`${index + 1}번째 명언으로 이동`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}