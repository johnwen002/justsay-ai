import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    port: 3000,
    proxy: {
      "/rsshub": {
        target: "http://localhost:1200",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rsshub/, ""),
      },
      "/avatar": {
        target: "http://localhost:3001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/avatar/, ""),
      },
      // "/api": {
      //   target: "http://localhost:8888",
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, ""),
      // },
    },
  },
});
