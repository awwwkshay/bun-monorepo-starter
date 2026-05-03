import { build, Glob } from "bun";

// Generate type declarations via tsc
const tsc = Bun.spawn(
  ["bunx", "tsc", "--project", "tsconfig.json", "--noEmit", "false"],
  {
    stdout: "inherit",
    stderr: "inherit",
  },
);
const tscExitCode = await tsc.exited;
if (tscExitCode !== 0) {
  console.error("Type generation failed");
  process.exit(tscExitCode);
}

// Bundle and minify all source files, preserving directory structure
const entrypoints = await Array.fromAsync(new Glob("src/**/*.ts").scan("."));

const result = await build({
  entrypoints,
  outdir: "dist",
  format: "esm",
  target: "bun",
  minify: true,
  root: "src",
});

if (!result.success) {
  console.error("Build failed");
  for (const message of result.logs) {
    console.error(message);
  }
  process.exit(1);
} else {
  console.log("Build succeeded");
}
