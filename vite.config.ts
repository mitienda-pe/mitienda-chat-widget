import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: 'src/main.ts',
      name: 'MiTiendaChat',
      fileName: 'mitienda-chat',
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        assetFileNames: 'mitienda-chat.[ext]',
      },
    },
  },
  define: {
    'process.env': {},
  },
});
