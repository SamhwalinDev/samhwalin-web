import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'default' | 'content' | 'narrow';
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'default', children, ...props }, ref) => {
    const sizes = {
      default: 'max-w-container',
      content: 'max-w-content',
      narrow: 'max-w-narrow',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'w-full mx-auto px-6 lg:px-12',
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';

// Section 컴포넌트
interface SectionProps extends HTMLAttributes<HTMLElement> {
  as?: 'section' | 'div';
  spacing?: 'default' | 'sm' | 'lg';
  background?: 'default' | 'gray' | 'white';
}

const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, as: Component = 'section', spacing = 'default', background = 'default', children, ...props }, ref) => {
    const spacings = {
      default: 'py-20 lg:py-32',
      sm: 'py-12 lg:py-16',
      lg: 'py-24 lg:py-40',
    };

    const backgrounds = {
      default: 'bg-base',
      gray: 'bg-muted',
      white: 'bg-white',
    };

    return (
      <Component
        // @ts-ignore - forwardRef 타입 이슈
        ref={ref}
        className={cn(spacings[spacing], backgrounds[background], className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Section.displayName = 'Section';

export { Container, Section };
