import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    // Log the error but don't re-throw here so the server stays up in development environments.
    try {
      log(err.stack || err.message || err);
    } catch (e) {
      // ignore logging failures
    }
    return;
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }


  const port = parseInt(process.env.PORT || "5000", 10);
  const preferredHost = process.env.HOST || "127.0.0.1";

  const listenPromise = (opts: any) =>
    new Promise<void>((resolve, reject) => {
      const onError = (err: any) => {
        server.removeListener("listening", onListening);
        reject(err);
      };

      const onListening = () => {
        server.removeListener("error", onError);
        resolve();
      };

      server.once("error", onError);
      server.once("listening", onListening);
      // call listen
      (server as any).listen(opts);
    });

  try {
    await listenPromise({ port, host: preferredHost, reusePort: true });
    log(`serving on port ${port} (host ${preferredHost})`);
  } catch (err: any) {
    log(`listen failed for host ${preferredHost}: ${err?.code || err?.message || err}. Retrying on 127.0.0.1 without reusePort.`);
    try {
      await listenPromise({ port, host: "127.0.0.1" });
      log(`serving on port ${port} (host http://127.0.0.1:5000)`);
    } catch (err2: any) {
      log(`failed to start server: ${err2?.code || err2?.message || err2}`);
      throw err2;
    }
  }
})();
