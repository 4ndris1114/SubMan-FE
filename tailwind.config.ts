/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'media',
  content: [],
  theme: {
    screens: {
      'xs': '360px',    // For small mobile devices
      'sm': '640px',    // For medium mobile devices and small tablets
      'md': '768px',    // For tablets
      'lg': '1024px',   // For larger tablets and small laptops
      'xl': '1280px',   // For desktops and large monitors
      '2xl': '1920px',  // For very large monitors or Full HD screens
      '3xl': '2560px',  // For ultra-wide and 4K monitors
    },    
    extend: {
      keyframes: {
        'swim-in': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '50%': { transform: 'translateX(-10%)', opacity: '1' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'swim-out': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '50%': { transform: 'translateX(-10%)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
      },
      animation: {
        'swim-in': 'swim-in 0.5s ease-in-out',
        'swim-out': 'swim-out 0.5s ease-in-out',
      },
      colors: {}
    },
  },
  plugins: [],
}

