import federation from '@originjs/vite-plugin-federation';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const niftyRemoteUrl = env.VITE_MFE_NIFTY_URL || 'http://localhost:3001';
  const nasdaqRemoteUrl = env.VITE_MFE_NASDAQ_URL || 'http://localhost:3002';

  return {
    plugins: [
      react(),
      federation({
        name: 'container',
        remotes: {
          mfe_nifty: `${niftyRemoteUrl}/assets/remoteEntry.js`,
          mfe_nasdaq: `${nasdaqRemoteUrl}/assets/remoteEntry.js`
        },
        shared: ['react', 'react-dom']
      })
    ],
    build: {
      target: 'esnext'
    }
  };
});
