import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: process.env.DIST ?? "dist",
  },
});
