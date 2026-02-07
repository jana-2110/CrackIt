/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
            },
            colors: {
                brand: {
                    dark: '#0f172a', // Slate 900 - Deep & Professional
                    primary: '#4f46e5', // Indigo 600 - Professional & Trustworthy
                    secondary: '#7c3aed', // Violet 600 - Creative & Rich
                    accent: '#f59e0b', // Amber 500 - Warm & Energetic
                    surface: '#1e293b', // Slate 800 - Consistent dark surface
                    light: '#f8fafc', // Slate 50 - Soft white
                }
            },
            animation: {
                'blob': 'blob 7s infinite',
                'float': 'float 3s ease-in-out infinite',
            },
            keyframes: {
                blob: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        },
    },
    plugins: [],
}
