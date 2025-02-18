import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
const ASSET_URL = process.env.ASSET_URL || '';

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    plugins: [react()],
    server: {
      port: '3000',
    },
    base: `${ASSET_URL}/cp/app-seeding/`,
  };
});
