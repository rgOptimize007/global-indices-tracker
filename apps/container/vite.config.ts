import federation from '@originjs/vite-plugin-federation';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'container',
      remotes: {
        mfe_nifty: 'http://localhost:3001/assets/remoteEntry.js',
        mfe_nasdaq: 'http://localhost:3002/assets/remoteEntry.js'
      },
      shared: ['react', 'react-dom']
    })
  ],
  build: {
    target: 'esnext'
  }
});
