import * as esbuild from "esbuild";
import fs from "fs";
import path from "path";

// 主服务端
await esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  outfile: "dist/index.js",
  packages: "external",
  sourcemap: true,
});

// 登录 PoC 测试
await esbuild.build({
  entryPoints: ["tests/login.poc.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  outfile: "dist/login.poc.js",
  packages: "external",
  sourcemap: true,
});

// 复制 schema.sql 到 dist
const srcSql = path.join(process.cwd(), "src", "db", "schema.sql");
const dstSql = path.join(process.cwd(), "dist", "schema.sql");
if (fs.existsSync(srcSql)) {
  fs.copyFileSync(srcSql, dstSql);
  console.log("Copied schema.sql -> dist/schema.sql");
}

console.log("Build done.");
