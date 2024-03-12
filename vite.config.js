import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: "OKP-Front",
  plugins: [
    react(),
    
  ],


  define: {
    // Define the environment variables for the Vite build
    // These environment variables are available at build time, not runtime
    'process.env.VITE_SOME_KEY': JSON.stringify(process.env.VITE_REACT_APP_API_KEY),
  }
 
});
