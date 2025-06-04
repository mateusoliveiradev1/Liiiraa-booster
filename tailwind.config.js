module.exports = {
  content: ['./src/renderer/**/*.{html,js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      colors: {
        primary: '#2563eb',
        secondary: '#4c51bf',
        'primary-dark': '#1e40af',
        'secondary-dark': '#3730a3',
        success: '#16a34a',
        'success-dark': '#166534',
        warning: '#f59e0b',
        'warning-dark': '#b45309',
        accent: '#8b5cf6',
        'accent-dark': '#6d28d9',
        danger: '#dc2626',
        'danger-dark': '#991b1b',
        background: '#f3f4f6',
        'background-dark': '#111827',
        surface: '#ffffff',
        'surface-dark': '#1f2937',
        border: '#e5e7eb',
        'border-dark': '#374151',
        muted: '#f3f4f6',
        'muted-dark': '#4b5563',
        premium: '#d4af37',
        'premium-dark': '#b8860b'
      }
    }
  },
  plugins: []
};
