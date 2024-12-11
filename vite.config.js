import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
// import process from "./back_end_files/process"
// import dotenv from "./back_end_files/dotenv"

//dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: `http://localhost:3000`, //${process.env.DB_PORT}
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        //stuff added from here: https://stackoverflow.com/questions/64677212/how-to-configure-proxy-in-vite
        secure: false,
        ws: true,
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (req) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
      }
    }
  }
})