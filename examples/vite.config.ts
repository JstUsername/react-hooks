import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  root: __dirname,
  plugins: [react()],
  base: process.env.NODE_ENV === 'development' ? '/' : '/react-hooks/',
});
