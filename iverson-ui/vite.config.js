import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: {
        iverson: resolve(__dirname, 'src/iverson.js'),
      },
      formats: ['es'],
    },
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        assetFileNames: 'iverson.[ext]',
        entryFileNames: 'iverson.js',
      },
    },
    outDir: 'dist',
  },
});
