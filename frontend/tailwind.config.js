/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#FFFFFF',
          alt: '#F5F5F7',
        },
        ink: {
          DEFAULT: '#1D1D1F',
          muted: '#6E6E73',
        },
        border: '#D2D2D7',
        accent: {
          DEFAULT: '#0071E3',
          soft: 'rgba(0, 113, 227, 0.10)',
        },
        glass: {
          bg: 'rgba(255,255,255,0.55)',
          border: 'rgba(255,255,255,0.35)',
        },
      },
      fontFamily: {
        display: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"Inter"', '"Helvetica Neue"', 'sans-serif'],
        body: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"Inter"', '"Helvetica Neue"', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '16px',
        lg: '24px',
      },
      boxShadow: {
        card: '0 4px 20px rgba(0,0,0,0.06)',
        'card-hover': '0 12px 32px rgba(0,0,0,0.12)',
        glass: '0 8px 32px rgba(0,0,0,0.08)',
      },
      maxWidth: {
        site: '1440px',
      },
    },
  },
  plugins: [],
};
