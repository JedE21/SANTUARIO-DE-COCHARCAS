/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        marfil: '#F5F1E8',
        blanco: '#FFFFFF',
        piedra: '#D8D0C1',
        tierra: '#7A6250',
        marron: '#3A3029',
        'marron-profundo': '#262019',
        negro: '#171615',
        dorado: '#B08A45',
        // Compatibilidad con clases legadas (ahora apuntan a la nueva identidad)
        azul: '#3A3029',
        'azul-oscuro': '#262019',
        carmesi: '#7A6250',
        'carmesi-oscuro': '#5D4B3C',
        'verde-andes': '#56504A',
        carbone: '#171615',
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
        destructive: '#A33B2E',
        'destructive-foreground': '#FFFFFF',
        input: 'var(--color-border)',
        ring: 'var(--color-primary)',
      },
      fontFamily: {
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-title)', 'Georgia', 'serif'],
      },
      letterSpacing: {
        editorial: '0.28em',
      },
    },
  },
  plugins: [],
};
