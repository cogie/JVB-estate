import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: "http://localhost:3000", //proxy, each time see the api add the locahost:3000 at the beggining
        secure:false,
      },
    },
  },
  
  plugins: [react()],
});
