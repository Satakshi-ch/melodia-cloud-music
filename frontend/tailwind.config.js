/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#000000', // Pure black
          800: '#0a0512', // Very dark purple black
          700: '#140c24', // Glass base purple
          600: '#1f1336', // Lighter purple panel
          500: '#2b1a4a', // Border purple
        },
        brand: {
          purple: '#8b5cf6', // Indigo-500 equivalent
          pink: '#ec4899',   // Pink-500 equivalent
          glow: '#d946ef',   // Fuchsia-500 equivalent
        }
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(to right, #8b5cf6, #ec4899)',
        'glass-gradient': 'linear-gradient(135deg, rgba(20, 12, 36, 0.4) 0%, rgba(10, 5, 18, 0.7) 100%)',
        'radial-glow': 'radial-gradient(circle at center, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-inset': 'inset 0 0 12px rgba(255, 255, 255, 0.05)',
        'brand-neon': '0 0 15px rgba(139, 92, 246, 0.5), 0 0 25px rgba(236, 72, 153, 0.3)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
