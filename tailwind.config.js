export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        card: '#18181b',
        muted: '#27272a',
        foreground: '#fafafa',
        'muted-foreground': '#a1a1aa',
        border: 'rgba(255, 255, 255, 0.1)',
        success: '#10b981',
        error: '#ef4444'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif']
      }
    }
  },
  plugins: []
};
