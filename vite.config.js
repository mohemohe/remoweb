import { execSync } from "child_process";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";
import { viteStaticCopy } from "vite-plugin-static-copy";

const fullHash = execSync("git rev-parse HEAD").toString().trim();

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, __dirname), VITE_GIT_HASH: fullHash };

  return {
    root: "./src/",
    server: {
      hmr: {
        protocol: "ws",
        host: "localhost",
      },
    },
    build: {
      sourcemap: true,
      outDir: path.resolve(__dirname, "dist"),
    },
    plugins: [
      tsconfigPaths({
        root: __dirname,
      }),
      react({
        jsxImportSource: "@emotion/react",
        babel: {
          parserOpts: {
            plugins: ["decorators-legacy", "classProperties", "@emotion/babel-plugin"],
          },
        },
      }),
      VitePWA({
        manifest: {
          name: "RemoWeb",
          short_name: "RemoWeb",
          description: "Web client for Nature Remo",
          background_color: "#000000",
          theme_color: "#90caf9",
          icons: [
            {
              src: "/assets/pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/assets/pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
        injectRegister: null,
      }),
      viteStaticCopy({
        targets: [
          {
            src: path.resolve(__dirname, "src/assets/pwa-192x192.png"),
            dest: "assets",
          },
          {
            src: path.resolve(__dirname, "src/assets/pwa-512x512.png"),
            dest: "assets",
          },
        ],
      }),
    ],
    esbuild: {
      // REF: https://github.com/vitejs/vite/issues/8644
      logOverride: { "this-is-undefined-in-esm": "silent" },
    },
  };
});
