import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        reply: path.resolve(__dirname, 'reply.html'),
        admin: path.resolve(__dirname, 'admin.html'),
      },
    },
  },
});
