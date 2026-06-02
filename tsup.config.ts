import { defineConfig } from "tsup";

// Dual ESM + CJS build with type declarations for both. The generated source
// uses ESM `.js` import specifiers; esbuild resolves those to the `.ts`
// sources automatically.
export default defineConfig({
  entry: ["index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  target: "es2020",
  outDir: "dist",
});
