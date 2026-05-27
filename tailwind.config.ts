import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '1650px',
    },
    extend: {
      colors: {
        navy: '#1a2f6e',
        green: '#4caf50',
        // Admin Bold design tokens
        adm: {
          rail:         '#070912',
          app:          '#0c0f18',
          panel:        '#11151f',
          panelAlt:     '#161b28',
          input:        '#080b14',
          border:       'rgba(100,150,255,0.10)',
          borderStrong: 'rgba(100,150,255,0.20)',
          textPri:      '#e8ebf2',
          textBody:     '#a0a6b6',
          textMut:      '#6a7187',
          textFnt:      '#454b5e',
        },
        nts: {
          green:        '#4caf50',
          info:         '#7dd3fc',
          warn:         '#fbbf24',
          danger:       '#f87171',
          purple:       '#c4b5fd',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        panel: '0 1px 0 rgba(255,255,255,0.02), 0 4px 12px rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [],
}
export default config
