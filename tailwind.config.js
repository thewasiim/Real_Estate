/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { ink: '#111111', muted: '#5B5B5B', surface: '#F7F7F5', line: '#E5E5E3', gold: '#C9A44C' },
      borderRadius: { sm: '8px', md: '16px', lg: '24px' },
      boxShadow: { card: '0 4px 20px rgba(0, 0, 0, 0.06)', elevated: '0 12px 32px rgba(0, 0, 0, 0.12)' },
    },
  },
  plugins: [],
}
