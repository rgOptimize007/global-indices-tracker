import federation from '@originjs/vite-plugin-federation';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'mfe_nasdaq',
      filename: 'remoteEntry.js',
      exposes: {
        './MarketCard': './src/MarketCard.tsx'
      },
      shared: ['react', 'react-dom']
    })
  ],
  build: {
    target: 'esnext'
  }
});
