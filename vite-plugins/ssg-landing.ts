// vite-plugins/ssg-landing.ts
import type { Plugin, Rollup } from "vite";
import { isRunnableDevEnvironment } from "vite";
import path from "node:path";
import { readdirSync, writeFileSync, rmSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { renderToString } from "react-dom/server";

export interface SsgLandingOptions {
  entryServer: string;
  entryClient: string;
  outDir: string;
  publicPath: string;
}

function normalizeOutputs(
  result: Rollup.RolldownOutput | Rollup.RolldownOutput[]
): (Rollup.OutputChunk | Rollup.OutputAsset)[] {
  const outputs = Array.isArray(result) ? result : [result];
  return outputs.flatMap((o) => o.output);
}

export function ssgLandingPlugin(options: SsgLandingOptions): Plugin {
  const root = process.cwd();
  const entryServerPath = path.resolve(root, options.entryServer);
  const entryClientPath = path.resolve(root, options.entryClient);
  const outDir = path.resolve(root, options.outDir);
  const tmpDir = path.resolve(root, ".ssg-landing-tmp");

  return {
    name: "ssg-landing",

    config() {
      return {
        environments: {
          landing: {
            consumer: "server",
            build: {
              outDir: path.relative(root, tmpDir),
              rollupOptions: { input: entryServerPath },
            },
          },
          landingClient: {
            consumer: "client",
            build: {
              outDir: path.relative(root, outDir),
              rollupOptions: {
                input: entryClientPath,
                output: { entryFileNames: "client.js" },
              },
            },
          },
        },
      };
    },

    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith(options.publicPath)) return next();

        try {
          const landingEnv = server.environments.landing;
          if (!isRunnableDevEnvironment(landingEnv)) {
            throw new Error("[ssg-landing] el entorno 'landing' no es ejecutable en este contexto");
          }

          const mod = await landingEnv.runner.import(entryServerPath);
          const appHtml = renderToString(mod.App());
          const headHtml =
            typeof mod.DocumentHead === "function" ? renderToString(mod.DocumentHead()) : "";

          const html = await server.transformIndexHtml(
            req.url,
            `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  ${headHtml}
</head>
<body>
  <div id="root">${appHtml}</div>
  <script type="module" src="/${path.relative(root, entryClientPath)}"></script>
</body>
</html>`
          );

          res.setHeader("Content-Type", "text/html");
          res.end(html);
        } catch (e) {
          if (e instanceof Error) {
            server.ssrFixStacktrace(e);
          }
          next(e);
        }
      });
    },

    async buildApp(builder) {
      const [, clientResult] = await Promise.all([
        builder.build(builder.environments.landing),
        builder.build(builder.environments.landingClient),
      ]);

      // builder.build() puede devolver un Watcher en modo watch — acá no aplica, se descarta el tipo
      const clientOutputs = normalizeOutputs(
        clientResult as Rollup.RolldownOutput | Rollup.RolldownOutput[]
      );

      const cssLinks = clientOutputs
        .filter((chunk) => chunk.type === "asset" && chunk.fileName.endsWith(".css"))
        .map((chunk) => `<link rel="stylesheet" href="./${chunk.fileName}" />`)
        .join("\n  ");

      try {
        const entryFile = readdirSync(tmpDir).find((f) => f.endsWith(".js"));
        if (!entryFile) throw new Error("[ssg-landing] no se encontró el bundle SSR");

        const modulePath = pathToFileURL(path.join(tmpDir, entryFile)).href;
        type LandingModule = {
          App: () => React.JSX.Element;
          DocumentHead?: () => React.JSX.Element;
        };

        const { App, DocumentHead } =
          (await import(/* @vite-ignore */ `${modulePath}?t=${Date.now()}`)) as LandingModule;
        const html = renderToString(App());
        const headHtml =
          typeof DocumentHead === "function"
            ? renderToString(DocumentHead())
            : "";

        writeFileSync(
          path.join(outDir, "index.html"),
          `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  ${headHtml}
  ${cssLinks}
</head>
<body>
  <div id="root">${html}</div>
  <script type="module" src="./client.js"></script>
</body>
</html>`
        );
      } finally {
        rmSync(tmpDir, { recursive: true, force: true });
      }
    },
  };
}