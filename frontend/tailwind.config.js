module.exports = {
  content: ['./src/pages/**/*.{ts,tsx}','./src/components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: '#00ffff',
          green: '#39ff14',
          magenta: '#ff00ff'
        }
      },
      boxShadow: {
        'neon-cyan': '0 0 8px rgba(0,255,255,0.6)',
        'neon-magenta': '0 0 8px rgba(255,0,255,0.4)'
      }
    }
  },
  plugins: []
};
