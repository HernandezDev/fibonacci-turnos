// vite-plugins/ssg-landing.ts
import type { Plugin } from "vite";
import path from "node:path";
import { readdirSync, writeFileSync, rmSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { renderToString } from "react-dom/server";

export function ssgLandingPlugin(): Plugin {
  return {
    name: "ssg-landing",
    config() {
      return {
        environments: {
          landing: {
            build: {
              outDir: "dist/.landing-tmp",
              rollupOptions: {
                input: path.resolve(process.cwd(), "src/landing/App.tsx"),
              },
            },
          },
          landingClient: {
            build: {
              outDir: "dist/landing",
              rollupOptions: {
                input: path.resolve(process.cwd(), "src/landing/main.tsx"),
                output: { entryFileNames: "client.js" },
              },
            },
          },
        },
      };
    },
    async buildApp(builder) {
      await Promise.all([
        builder.build(builder.environments.landing),
        builder.build(builder.environments.landingClient),
      ]);

      const tmpDir = path.resolve(process.cwd(), "dist/.landing-tmp");
      const entryFile = readdirSync(tmpDir).find((f) => f.endsWith(".js"));
      if (!entryFile) throw new Error("[ssg-landing] no se encontró el bundle SSR");

      const modulePath = pathToFileURL(path.join(tmpDir, entryFile)).href;
      const { App } = await import(`${modulePath}?t=${Date.now()}`);
      const html = renderToString(App());

      const outDir = path.resolve(process.cwd(), "dist/landing");
      writeFileSync(
        path.join(outDir, "index.html"),
        `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Instituto Fibonacci — Turnos</title>
</head>
<body>
  <div id="root">${html}</div>
  <script type="module" src="/landing/client.js"></script>
</body>
</html>`
      );

      rmSync(tmpDir, { recursive: true, force: true });
    },
  };
}