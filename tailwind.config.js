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
        pastel: {
          peach: '#F7DFCA',
          beige: '#EFE3D3',
          lavender: '#DAD6EB',
          lilac: '#E2DFEE',
          blue: '#CFDEF3',
          sky: '#D6E4F0',
          mint: '#D8E8DC',
          slate: '#8F9CAE',
        },
        wealth: {
          orange: '#FF8A00',
          amber: '#F99D20',
          gold: '#F59E0B',
          blue: '#3B82F6',
          teal: '#14B8A6',
          green: '#10B981',
          rose: '#F43F5E',
          purple: '#8B5CF6',
        }
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
        '5xl': '2.75rem',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-hover': '0 12px 40px 0 rgba(31, 38, 135, 0.12)',
        'glass-card': '0 4px 20px 0 rgba(0, 0, 0, 0.04)',
        'glass-inner': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.7)',
        'pill': '0 2px 10px rgba(0, 0, 0, 0.05)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
};
