import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Colors
      colors: {
        // Primary (Orange)
        primary: {
          DEFAULT: '#F49249',
          light: '#F5A364',
          dark: '#E07A2E',
          'extra-light': '#FCE0CC',
        },
        // Secondary (Purple-Gray)
        secondary: {
          DEFAULT: '#7B7FA8',
          light: '#9FA3C7',
          dark: '#5B5F8F',
          'extra-light': '#E8E9F3',
        },
        // Accent (Green)
        accent: {
          DEFAULT: '#7A9B7E',
          light: '#9BB89F',
          dark: '#5A7A5E',
          'extra-light': '#E8F2E9',
        },
        // Background
        background: {
          DEFAULT: '#FFFFFE',
          light: '#FFFFFE',
          dark: '#F6F6FE',
        },
        // Text
        text: {
          DEFAULT: '#2D3748',
          disabled: 'rgba(45, 55, 72, 0.4)',
        },
        // Legacy alias (for backward compatibility)
        base: '#FFFFFE',
        // Semantic status colors
        success: '#7A9B7E',
        warning: '#F4B449',
        error: '#E85D5D',
        info: '#7B7FA8',
        // Semantic gray tokens
        muted: {
          DEFAULT: '#F9FAFB',  // gray-50 - section backgrounds
          foreground: '#6B7280', // gray-500 - secondary text
        },
        border: '#E5E7EB',  // gray-200 - default borders
        foreground: '#111827', // gray-900 - headings, primary text
      },

      // Typography
      fontFamily: {
        sans: [
          'Pretendard Variable',
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Roboto',
          'Helvetica Neue',
          'Segoe UI',
          'Apple SD Gothic Neo',
          'Noto Sans KR',
          'Malgun Gothic',
          'sans-serif',
        ],
      },
      fontSize: {
        'display': ['2.5rem', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.02em' }],
        'display-sm': ['2rem', { lineHeight: '1.25', fontWeight: '700', letterSpacing: '-0.02em' }],
        // Article content heading sizes
        'article-h1': ['1.875rem', { lineHeight: '1.3', fontWeight: '700', letterSpacing: '-0.02em' }], // 30px
        'article-h2': ['1.5rem', { lineHeight: '1.35', fontWeight: '600', letterSpacing: '-0.01em' }],  // 24px
        'article-h3': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],  // 20px
        // UI heading sizes
        'h1': ['1.75rem', { lineHeight: '1.3', fontWeight: '600', letterSpacing: '-0.02em' }],
        'h2': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'h3': ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75' }],
        'body': ['1.0625rem', { lineHeight: '1.75' }],
        'body-sm': ['0.9375rem', { lineHeight: '1.6' }],
        'caption': ['0.875rem', { lineHeight: '1.5' }],
        'small': ['0.75rem', { lineHeight: '1.5' }],
      },

      // Spacing
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },

      // Layout
      maxWidth: {
        'container': '1200px',
        'content': '680px',
        'narrow': '480px',
      },

      // Shadows
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'md': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'lg': '0 8px 24px rgba(0, 0, 0, 0.1)',
        'xl': '0 16px 48px rgba(0, 0, 0, 0.12)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.1)',
      },

      // Border Radius
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },

      // Transitions
      transitionDuration: {
        'fast': '150ms',
        'normal': '200ms',
        'slow': '300ms',
      },
      transitionTimingFunction: {
        'out': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },

      // Keyframes & Animations
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 300ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
