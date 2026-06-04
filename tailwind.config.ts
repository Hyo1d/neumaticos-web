import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        carbon: '#0A0A0A',
        asphalt: '#2A2A2A',
        rubber: '#252A78',
        brandBlue: '#252A78',
        whatsapp: '#25D366',
        whatsappDark: '#128C7E',
        smoke: '#F5F5F5'
      },
      fontFamily: {
        display: ['var(--font-display)', 'Arial Narrow', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}

export default config
