/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stem: {
          red: {
            DEFAULT: '#ff3b30',
            light: '#ffe5e5',
            dark: '#d32f2f',
            border: '#ff0000',
          },
          purple: {
            DEFAULT: '#8c52ff',
            light: '#f3e8ff',
            dark: '#6b21a8',
            border: '#8c52ff',
          },
          blue: {
            DEFAULT: '#38b6ff',
            light: '#e0f2fe',
            dark: '#0369a1',
            border: '#38b6ff',
          },
          green: {
            DEFAULT: '#7ed957',
            light: '#dcfce7',
            dark: '#15803d',
            border: '#7ed957',
          },
          orange: {
            DEFAULT: '#ff914d',
            light: '#ffedd5',
            dark: '#c2410c',
            border: '#ff914d',
          },
          yellow: {
            DEFAULT: '#facc15',
            light: '#fef9c3',
            dark: '#854d0e',
            border: '#ffff00',
          },
        },
      },
      fontFamily: {
        sans: ['"Segoe UI"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Roboto', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pop-in': 'popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.92) translateY(10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

