import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
//import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    emptyOutDir: false,
    copyPublicDir: false,
    cssCodeSplit: false, // single CSS file
    lib: {
      entry: "src/bundle.js", // same entry
      name: "nexSys", // global var in IIFE build
      fileName: () => "nexsys.min.js",
      formats: ["iife"], // one self‑executing <script>
    },

    /* Rollup options for externals & globals */
    rollupOptions: {
      external: ["react", "react-dom", "react-dom/client", "nexevent"],
      output: {
        globals: {
          react: "React", // case‑exact like your webpack externals
          "react-dom": "ReactDOM",
          "react-dom/client": "ReactDOM",
          nexevent: "eventStream", // Nexus global
        },
        inlineDynamicImports: true,
      },
    },

    /* Minification ------------------------------------ */
    minify: "terser", // esbuild is default but terser is safer
    terserOptions: {
      ecma: 2020,
      mangle: true,
      keep_fnames: true,
      keep_classnames: true,
      compress: {
        // Stop the specific transform that inlines your handler
        inline: 0, // disable function inlining
        reduce_funcs: false, // don't fold function expressions
        reduce_vars: false, // don't inline single-use consts
        passes: 1,
        keep_fargs: true,
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/localMockUp.js", "./src/tests/setupTests.js"],
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
});
