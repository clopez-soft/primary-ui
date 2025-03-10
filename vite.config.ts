import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import svgr from "vite-plugin-svgr";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    svgr(),
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "src/assets/*",
          dest: "assets/",
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 8080,
    // proxy: {
    //   "/graphql": {
    //     target: "http://localhost:5050",
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },
  },
});
