import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        card1: resolve(__dirname, 'card-1.html'),
        card2: resolve(__dirname, 'card-2.html'),
      },
    },
  },
});
