import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Serve on port 3000
    host: true, // Allow external access (essential for preview and containers)
  },
});
