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
                canvas: 'rgb(var(--color-base) / <alpha-value>)',
                alt: 'rgb(var(--color-alt) / <alpha-value>)',
                ink: {
                    DEFAULT: 'rgb(var(--color-ink) / <alpha-value>)',
                    muted: 'rgb(var(--color-ink-muted) / <alpha-value>)',
                },
                accent: {
                    DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
                    light: 'rgb(var(--color-accent-light) / <alpha-value>)',
                    hover: 'rgb(var(--color-accent-hover) / <alpha-value>)',
                },
                'paper-border': 'rgb(var(--color-paper-border) / <alpha-value>)',
                'pulse-surface': 'rgb(var(--color-pulse-surface) / <alpha-value>)',
                'status-success': 'rgb(var(--color-status-success) / <alpha-value>)',
                'status-danger': 'rgb(var(--color-status-danger) / <alpha-value>)',
                'status-critical': 'rgb(var(--color-status-critical) / <alpha-value>)',
                linkedin: 'rgb(var(--color-linkedin) / <alpha-value>)',
                facebook: 'rgb(var(--color-facebook) / <alpha-value>)',
                instagram: 'rgb(var(--color-instagram) / <alpha-value>)',
                'product-navy': 'rgb(var(--color-product-navy) / <alpha-value>)',
                'product-navy-dark': 'rgb(var(--color-product-navy-dark) / <alpha-value>)',
                'product-gold': 'rgb(var(--color-product-gold) / <alpha-value>)',
                'product-charcoal': 'rgb(var(--color-product-charcoal) / <alpha-value>)',
                'product-cream': 'rgb(var(--color-product-cream) / <alpha-value>)',
            },
            fontFamily: {
                serif: ['"Playfair Display"', 'Georgia', 'serif'],
                sans: ['"Inter"', 'Arial', 'sans-serif'],
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
