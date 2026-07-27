import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [react(), tailwindcss()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
  build: {
    // The only browser this ever runs in is the bundled webview, so there is no
    // reason to downlevel anything. Keeps the output smaller and skips helper
    // shims for syntax the webview already supports.
    target: 'esnext',
  },
  resolve: {
    // Mirrors `paths` in tsconfig.json. This used to read `tsconfigPaths: true`,
    // which is not a Vite option and did nothing — `@/` resolved only because
    // Vite happens to fall back to reading tsconfig paths itself.
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}));
