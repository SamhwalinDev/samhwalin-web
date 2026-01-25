'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

type AnimationType = 
  | 'fade-up' 
  | 'fade-down'
  | 'fade-left' 
  | 'fade-right' 
  | 'fade' 
  | 'scale' 
  | 'blur';

interface ScrollAnimationWrapperProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  animation?: AnimationType;
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
}

const animationStyles: Record<AnimationType, { hidden: string; visible: string }> = {
  'fade-up': {
    hidden: 'opacity-0 translate-y-12',
    visible: 'opacity-100 translate-y-0',
  },
  'fade-down': {
    hidden: 'opacity-0 -translate-y-12',
    visible: 'opacity-100 translate-y-0',
  },
  'fade-left': {
    hidden: 'opacity-0 translate-x-12',
    visible: 'opacity-100 translate-x-0',
  },
  'fade-right': {
    hidden: 'opacity-0 -translate-x-12',
    visible: 'opacity-100 translate-x-0',
  },
  'fade': {
    hidden: 'opacity-0',
    visible: 'opacity-100',
  },
  'scale': {
    hidden: 'opacity-0 scale-95',
    visible: 'opacity-100 scale-100',
  },
  'blur': {
    hidden: 'opacity-0 blur-sm scale-98',
    visible: 'opacity-100 blur-0 scale-100',
  },
};

export default function ScrollAnimationWrapper({ 
  children, 
  className = '',
  delay = 0,
  duration = 800,
  animation = 'fade-up',
  once = true,
  threshold = 0.15,
  rootMargin = '0px 0px -80px 0px'
}: ScrollAnimationWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { 
        threshold,
        rootMargin
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [once, threshold, rootMargin]);

  const styles = animationStyles[animation];

  return (
    <div
      ref={ref}
      className={`
        transition-all
        ${isVisible ? styles.visible : styles.hidden}
        ${className}
      `}
      style={{ 
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)', // Toss-like smooth easing
      }}
    >
      {children}
    </div>
  );
}

// Staggered animation wrapper for multiple children
interface StaggeredAnimationWrapperProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  threshold?: number;
  rootMargin?: string;
}

export function StaggeredAnimationWrapper({
  children,
  className = '',
  staggerDelay = 150,
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px'
}: StaggeredAnimationWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? 'animate-stagger' : ''}`}
    >
      {children}
    </div>
  );
}