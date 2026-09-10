import type { Config } from 'tailwindcss'

/**
 * ROADBOY GYM&SPORTS design system.
 *
 * The palette is deliberately narrow: a charcoal/black ground, bone-white
 * typography and exactly one accent (ember) reserved for actions, prices and
 * anything the eye must find first. Resist adding a second accent.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '1.5rem', lg: '2rem', '2xl': '2.5rem' },
      screens: { '2xl': '1360px' },
    },
    extend: {
      colors: {
        ink: '#08090B',      // page ground
        coal: '#101114',     // raised surface
        steel: '#17191D',    // card surface
        iron: '#212429',     // hover surface
        line: 'rgba(255,255,255,0.09)',
        bone: '#F4F2EF',     // primary type
        ash: '#8D9199',      // secondary type
        slate2: '#5A5E66',   // tertiary type
        ember: {
          DEFAULT: '#FF4A1C',
          soft: '#FF6B44',
          deep: '#D93408',
          ghost: 'rgba(255,74,28,0.12)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Barlow Condensed', 'Impact', 'sans-serif'],
        sans: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Fluid display scale — mobile-first, never smaller than readable.
        'display-xl': ['clamp(3.25rem, 11vw, 9rem)', { lineHeight: '0.88', letterSpacing: '-0.02em', fontWeight: '800' }],
        'display-lg': ['clamp(2.75rem, 7.5vw, 6rem)', { lineHeight: '0.9', letterSpacing: '-0.02em', fontWeight: '800' }],
        'display-md': ['clamp(2.25rem, 5vw, 4rem)', { lineHeight: '0.94', letterSpacing: '-0.015em', fontWeight: '800' }],
        'display-sm': ['clamp(1.75rem, 3.4vw, 2.75rem)', { lineHeight: '1', letterSpacing: '-0.01em', fontWeight: '700' }],
        eyebrow: ['0.75rem', { lineHeight: '1', letterSpacing: '0.22em', fontWeight: '600' }],
        lede: ['clamp(1.0625rem, 1.5vw, 1.25rem)', { lineHeight: '1.6' }],
      },
      spacing: { section: 'clamp(4.5rem, 9vw, 9rem)' },
      borderRadius: { xs: '2px', sm: '3px', DEFAULT: '4px', md: '6px', lg: '8px' },
      boxShadow: {
        lift: '0 24px 60px -20px rgba(0,0,0,0.85)',
        ember: '0 12px 40px -12px rgba(255,74,28,0.5)',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
        io: 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      keyframes: {
        'fade-up': { from: { opacity: '0', transform: 'translateY(18px)' }, to: { opacity: '1', transform: 'none' } },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        'scroll-hint': {
          '0%': { transform: 'translateY(-40%)', opacity: '0' },
          '35%': { opacity: '1' },
          '100%': { transform: 'translateY(140%)', opacity: '0' },
        },
        'slide-down': { from: { opacity: '0', transform: 'translateY(-8px)' }, to: { opacity: '1', transform: 'none' } },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in': 'fade-in 0.5s ease both',
        marquee: 'marquee 38s linear infinite',
        'scroll-hint': 'scroll-hint 2s cubic-bezier(0.65,0,0.35,1) infinite',
        'slide-down': 'slide-down 0.22s cubic-bezier(0.22,1,0.36,1) both',
      },
    },
  },
  plugins: [],
}

export default config
