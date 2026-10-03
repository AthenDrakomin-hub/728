import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/index.ts", "tests/login.poc.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  outdir: "dist",
  packages: "external",
  sourcemap: true,
});

console.log("Build done.");
