import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  // Rutas relativas para que funcione en GitHub Pages (https://usuario.github.io/repo/)
  base: "./",
  server: { open: true },
  build: {
    rollupOptions: {
      input: {
        inicio: resolve(import.meta.dirname, "index.html"),
        tienda: resolve(import.meta.dirname, "tienda.html"),
        reporte: resolve(import.meta.dirname, "reporte.html"),
      },
    },
  },
});
