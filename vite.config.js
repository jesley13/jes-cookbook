import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        recipe: resolve(import.meta.dirname, 'recipe.html'),
        admin: resolve(import.meta.dirname, 'admin/index.html'),
      },
    },
  },
});
