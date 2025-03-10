// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae1fd',
          300: '#7dcbfc',
          400: '#38adf8',
          500: '#0e95e9',
          600: '#0276c7',
          700: '#0359a1',
          800: '#074985',
          900: '#0c3b6e',
          950: '#062448',
        },
        dark: {
          background: '#121212',
          surface: '#1e1e1e',
          card: '#252525',
          border: '#333333',
          hover: '#2a2a2a',
        },
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        }
      },
      boxShadow: {
        'elevation-1': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        'elevation-2': '0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12)',
        'elevation-3': '0 10px 20px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.1)',
        'elevation-4': '0 15px 25px rgba(0,0,0,0.15), 0 5px 10px rgba(0,0,0,0.05)',
        'inner-light': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'inner-dark': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.05)',
      },
      borderRadius: {
        'xl': '0.75rem', 
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: theme('colors.neutral.800'),
            '[class~="lead"]': {
              color: theme('colors.neutral.700'),
            },
            a: {
              color: theme('colors.primary.600'),
              '&:hover': {
                color: theme('colors.primary.700'),
              },
            },
            strong: {
              color: theme('colors.neutral.900'),
            },
            'ol > li::before': {
              color: theme('colors.neutral.600'),
            },
            'ul > li::before': {
              backgroundColor: theme('colors.neutral.400'),
            },
            hr: {
              borderColor: theme('colors.neutral.200'),
            },
            blockquote: {
              color: theme('colors.neutral.700'),
              borderLeftColor: theme('colors.neutral.300'),
            },
            h1: {
              color: theme('colors.neutral.900'),
            },
            h2: {
              color: theme('colors.neutral.900'),
            },
            h3: {
              color: theme('colors.neutral.900'),
            },
            h4: {
              color: theme('colors.neutral.900'),
            },
            'figure figcaption': {
              color: theme('colors.neutral.600'),
            },
            code: {
              color: theme('colors.neutral.900'),
              backgroundColor: theme('colors.neutral.100'),
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontFamily: theme('fontFamily.mono').join(', '),
            },
            'a code': {
              color: theme('colors.primary.600'),
            },
            pre: {
              color: theme('colors.neutral.200'),
              backgroundColor: theme('colors.neutral.800'),
              fontFamily: theme('fontFamily.mono').join(', '),
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.neutral.300'),
            '[class~="lead"]': {
              color: theme('colors.neutral.400'),
            },
            a: {
              color: theme('colors.primary.400'),
              '&:hover': {
                color: theme('colors.primary.300'),
              },
            },
            strong: {
              color: theme('colors.neutral.100'),
            },
            'ol > li::before': {
              color: theme('colors.neutral.400'),
            },
            'ul > li::before': {
              backgroundColor: theme('colors.neutral.600'),
            },
            hr: {
              borderColor: theme('colors.neutral.700'),
            },
            blockquote: {
              color: theme('colors.neutral.300'),
              borderLeftColor: theme('colors.neutral.600'),
            },
            h1: {
              color: theme('colors.neutral.100'),
            },
            h2: {
              color: theme('colors.neutral.100'),
            },
            h3: {
              color: theme('colors.neutral.100'),
            },
            h4: {
              color: theme('colors.neutral.100'),
            },
            'figure figcaption': {
              color: theme('colors.neutral.400'),
            },
            code: {
              color: theme('colors.neutral.100'),
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
            },
            'a code': {
              color: theme('colors.primary.400'),
            },
            pre: {
              color: theme('colors.neutral.200'),
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
  ],
}