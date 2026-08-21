import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import { ssgLandingPlugin } from "./vite-plugins/ssg-landing.ts";

export default defineConfig({
  plugins: [
    react(),
    cloudflare(),
    ssgLandingPlugin({
      entryServer: "src/landing/App.tsx",
      entryClient: "src/landing/main.tsx",
      outDir: "dist/landing",
      publicPath: "/landing",
    }),
  ],
});
