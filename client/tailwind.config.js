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
        brand: {
          50: '#fff7ed',
          100: '#feedd6',
          200: '#fcd7ac',
          300: '#f9b978',
          400: '#f79f58',
          500: '#f3731c',
          600: '#e45912',
          700: '#bd4211',
          800: '#963616',
          900: '#792e15',
          950: '#411509',
        },
        tanhide: {
          50: '#fff7ed',
          100: '#feedd6',
          200: '#fcd7ac',
          300: '#f9b978',
          400: '#f79f58',
          500: '#f3731c',
          600: '#e45912',
          700: '#bd4211',
          800: '#963616',
          900: '#792e15',
          950: '#411509',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(243, 115, 28, 0.25)',
        'stripe': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 6px 16px 0 rgba(0, 0, 0, 0.03)',
        'stripe-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 12px 24px -2px rgba(0, 0, 0, 0.07)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}
