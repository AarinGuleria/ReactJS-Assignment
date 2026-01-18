import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'prime-vendor': ['primereact'],
        },
      },
      external: (id) => {
        // Externalize optional PrimeReact dependencies that we don't use
        const optionalDeps = [
          'chart.js',
          'chart.js/auto',
          'quill',
          '@fullcalendar/core',
          '@fullcalendar/daygrid',
          '@fullcalendar/timegrid',
          '@fullcalendar/interaction',
        ]
        return optionalDeps.some(dep => id === dep || id.startsWith(`${dep}/`))
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    open: true,
  },
  preview: {
    port: 4173,
    open: true,
  },
})
