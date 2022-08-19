import { execSync } from "child_process";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

const fullHash = execSync("git rev-parse HEAD").toString().trim();
const shortHash = execSync("git rev-parse --short HEAD").toString().trim();

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
      sourcemap: process.env.AWS_CDK !== "1",
      outDir: process.env.AWS_CDK === "1" ? "/asset-output/" : "./dist/",
      assetsDir: `assets.${shortHash}`,
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
    ],
    esbuild: {
      // REF: https://github.com/vitejs/vite/issues/8644
      logOverride: { "this-is-undefined-in-esm": "silent" },
    },
  };
});
