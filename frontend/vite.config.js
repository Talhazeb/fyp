import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@mui/base': path.resolve(__dirname, 'node_modules/@mui/base')
    }
  }
});
