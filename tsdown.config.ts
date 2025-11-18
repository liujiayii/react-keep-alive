import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  dts: { build: true },
  outDir: "dist",
  format: ["esm"],
  // sourcemap: true,
});
