import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: { jsx: 'automatic' },
  server: { port: 4181, strictPort: true },
  preview: { port: 4181, strictPort: true },
});
