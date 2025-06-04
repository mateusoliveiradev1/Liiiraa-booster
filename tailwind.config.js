module.exports = {
  content: ['./src/renderer/**/*.{html,js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        'primary-dark': 'var(--color-primary-dark)',
        'secondary-dark': 'var(--color-secondary-dark)',
        success: 'var(--color-success)',
        'success-dark': 'var(--color-success-dark)',
        warning: 'var(--color-warning)',
        'warning-dark': 'var(--color-warning-dark)',
        accent: 'var(--color-accent)',
        'accent-dark': 'var(--color-accent-dark)',
        danger: 'var(--color-danger)',
        'danger-dark': 'var(--color-danger-dark)',
        background: 'var(--color-background)',
        'background-dark': 'var(--color-background-dark)',
        surface: 'var(--color-surface)',
        'surface-dark': 'var(--color-surface-dark)',
        border: 'var(--color-border)',
        'border-dark': 'var(--color-border-dark)',
        muted: 'var(--color-muted)',
        'muted-dark': 'var(--color-muted-dark)',
        premium: 'var(--color-premium)',
        'premium-dark': 'var(--color-premium-dark)',
        amd: 'var(--color-amd)',
        intel: 'var(--color-intel)',
        nvidia: 'var(--color-nvidia)'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out'
      }
    }
  },
  plugins: []
};
