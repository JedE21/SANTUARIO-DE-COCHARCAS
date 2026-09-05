/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        marfil: '#F7F3EA',
        blanco: '#FFFFFF',
        dorado: '#B89452',
        piedra: '#8C8173',
        'verde-andes': '#34483B',
        carbone: '#24231F',
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        primary: 'var(--color-primary)',
        'primary-foreground': 'var(--color-blanco)',
        secondary: 'var(--color-secondary)',
        'secondary-foreground': 'var(--color-blanco)',
        accent: 'var(--color-accent)',
        'accent-foreground': 'var(--color-blanco)',
        muted: 'var(--color-muted)',
        'muted-foreground': 'var(--color-muted-foreground)',
        'dorado-oscuro': 'var(--color-dorado-oscuro)',
        'dorado-claro': 'var(--color-dorado-claro)',
        border: 'var(--color-border)',
        card: 'var(--color-card)',
        'card-foreground': 'var(--color-foreground)',
        destructive: '#B91C1C',
        'destructive-foreground': '#FFFFFF',
        input: 'var(--color-border)',
        ring: 'var(--color-primary)',
      },
      fontFamily: {
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-title)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
