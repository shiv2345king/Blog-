import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/tinymce/skins',
          dest: 'tinymce'
        },
        {
          src: 'node_modules/tinymce/models',
          dest: 'tinymce'
        },
        {
          src: 'node_modules/tinymce/icons',
          dest: 'tinymce'
        },
        {
          src: 'node_modules/tinymce/themes',
          dest: 'tinymce'
        },
        {
          src: 'node_modules/tinymce/plugins',
          dest: 'tinymce'
        }
      ]
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})