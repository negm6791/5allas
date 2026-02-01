/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eff6ff',
                    500: '#3b82f6',
                    700: '#1d4ed8',
                },
                secondary: {
                    500: '#9333ea',
                    700: '#7e22ce',
                },
                growth: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                }
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
            },
            backdropBlur: {
                xs: '2px',
            },
            animation: {
                'bounce-soft': 'bounce 1s ease-in-out 2',
                'float': 'float 3s ease-in-out infinite',
                'grow': 'grow 1s ease-out',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                grow: {
                    '0%': { transform: 'scale(0)' },
                    '50%': { transform: 'scale(1.1)' },
                    '100%': { transform: 'scale(1)' },
                }
            }
        },
    },
    plugins: [],
}
