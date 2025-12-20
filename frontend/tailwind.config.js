/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./DaVeenciLandingPage.tsx",
        "./App.tsx"
    ],
    theme: {
        extend: {
            colors: {
                base: '#F5F0E6', // Light parchment
                alt: '#E4D6BD',  // Deeper tan
                ink: {
                    DEFAULT: '#222222', // Deep charcoal
                    muted: '#5A4A3A',   // Soft warm brown
                },
                accent: {
                    DEFAULT: '#3f84c8', // Updated Blue
                    light: '#64a1e0',
                    hover: '#2f6ca8',
                }
            },
            fontFamily: {
                serif: ['"IM Fell English"', 'serif'],
                sans: ['"Inter"', 'sans-serif'],
                script: ['"La Belle Aurore"', 'cursive'],
            },
            backgroundImage: {
                'paper-texture': "url('https://www.transparenttextures.com/patterns/cream-paper.png')",
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'float-delayed': 'float 6s ease-in-out 3s infinite',
                'float-slow': 'float 10s ease-in-out infinite',
                'spin-slow': 'spin 12s linear infinite',
                'spin-slower': 'spin 60s linear infinite',
                'spin-reverse-slower': 'spin-reverse 50s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'spin-reverse': {
                    'from': { transform: 'rotate(360deg)' },
                    'to': { transform: 'rotate(0deg)' },
                }
            }
        },
    },
    plugins: [],
}
