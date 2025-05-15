/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary dark theme colors
        gray: {
          900: '#121212', // Main background
          800: '#1E1E1E', // Card background
          700: '#2C2C2C', // Input background
          600: '#3D3D3D', // Button background
          500: '#505050', // Hover states
          400: '#7E7E7E', // Secondary text
          300: '#A0A0A0', // Muted text
          200: '#D4D4D4', // Primary text
          100: '#E5E5E5', // High emphasis text
        },
        indigo: {
          900: '#1E1A4A',
          800: '#2A2563',
          700: '#382F7E',
          600: '#4338CA', // Primary button
          500: '#4F46E5',
          400: '#6366F1',
          300: '#818CF8',
        },
        // Success, warning, error states
        green: {
          900: '#064E3B',
          800: '#065F46',
          700: '#047857',
          600: '#059669',
          500: '#10B981',
          400: '#34D399',
        },
        red: {
          900: '#7F1D1D',
          800: '#991B1B',
          700: '#B91C1C',
          600: '#DC2626',
          500: '#EF4444',
          400: '#F87171',
        },
        yellow: {
          900: '#78350F',
          800: '#92400E',
          700: '#B45309',
          600: '#D97706',
          500: '#F59E0B',
          400: '#FBBF24',
        }
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      boxShadow: {
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
};