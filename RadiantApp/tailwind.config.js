/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        valorant: {
          primary: '#0F1419',
          secondary: '#1A1F2E',
          accent: '#FF4655',
          gold: '#FFF500',
          light: '#C9C9C9',
        },
        valorant_dark: '#0F1419',
        valorant_light: '#C9C9C9',
      },
      fontFamily: {
        valorant: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        valorant: '0 0 20px rgba(255, 70, 85, 0.3)',
        valorant_gold: '0 0 20px rgba(255, 245, 0, 0.2)',
      },
      backgroundImage: {
        'gradient-valorant': 'linear-gradient(135deg, #0F1419 0%, #1A1F2E 100%)',
        'gradient-accent': 'linear-gradient(135deg, #FF4655 0%, #FF6B7A 100%)',
      },
      transition: {
        valorant: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
