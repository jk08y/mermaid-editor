// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Specific optimization for React 19
  optimizeDeps: {
    include: ['mermaid'],
    esbuildOptions: {
      target: 'es2020',
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Optimize for performance
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'mermaid-vendor': ['mermaid'],
          'editor-vendor': ['@monaco-editor/react'],
        },
      },
    },
    target: 'es2020',
  },
  server: {
    port: 3000,
    open: true,
  },
})