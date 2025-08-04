/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'charcoal': '#0d1117',
        'deep-gray': '#8b949e',
        'cool-blue': '#58a6ff',
        'neon-green': '#00ffcc',
        'dark-blue': '#161b22',
        'darker-blue': '#0a0c10',
        'glow-blue': 'rgba(88, 166, 255, 0.15)',
        'glow-green': 'rgba(0, 255, 204, 0.15)',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
        'exo': ['Exo', 'sans-serif'],
        'titillium': ['Titillium Web', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'rotate-slow': 'rotate 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 255, 204, 0.5)' }, // Match neon-green
          '100%': { boxShadow: '0 0 20px rgba(0, 255, 204, 0.8)' },
        },
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(to right, rgba(88, 166, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(88, 166, 255, 0.1) 1px, transparent 1px)',
      },
      boxShadow: {
        'neon': '0 0 15px 0 rgba(0, 255, 204, 0.5)',
        'neon-blue': '0 0 15px 0 rgba(88, 166, 255, 0.5)',
        'neon-green': '0 0 5px rgba(0, 255, 204, 0.5), 0 0 20px rgba(0, 255, 204, 0.3)',
      },
      textShadow: {
        'neon': '0 0 10px rgba(0, 255, 204, 0.7)',
        'neon-blue': '0 0 10px rgba(88, 166, 255, 0.7)',
      },
    },
  },
  plugins: [
    // Add glow-text utility to match LandingPage
    function ({ addUtilities }) {
      addUtilities({
        '.glow-text': {
          textShadow: '0 0 5px rgba(0, 255, 204, 0.7), 0 0 15px rgba(0, 255, 204, 0.4), 0 0 25px rgba(0, 255, 204, 0.2)',
        },
      });
    },
  ],
};