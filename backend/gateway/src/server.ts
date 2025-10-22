import express, { NextFunction, Request, Response } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import morgan from "morgan";

const app = express();

/** ---- CORS (terminate at the gateway) ---- */
const ALLOWED_ORIGINS = new Set([
  "http://localhost:3000",
  "http://localhost:3001",
]);

function corsGateway(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Authorization, Content-Type, X-Requested-With"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    );
    res.setHeader("Access-Control-Max-Age", "600");
  }
  if (req.method === "OPTIONS") return res.status(204).end(); // preflight short-circuit
  next();
}

app.use(corsGateway);
app.use(express.json());
app.use(morgan("tiny"));

/** ---- Targets ---- */
const AUTH_SERVICE = "http://localhost:4001";
const PAYMENT_SERVICE = "http://localhost:4002";
const PROPERTY_SERVICE = "http://localhost:4003";
const USER_SERVICE = "http://localhost:4004";

function serviceProxy(target: string) {
  return createProxyMiddleware({
    target,
    changeOrigin: true,          // updates Host header for upstream
    xfwd: true,                  // adds X-Forwarded-* headers
    proxyTimeout: 10_000,        // upstream stall protection
    timeout: 15_000,             // client socket timeout
    onProxyReq: (proxyReq: import("http").ClientRequest, req: Request, res: Response) => {
    },
    onError: (err: Error, req: Request, res: Response) => {
      if (!res.headersSent) {
        res.status(502).json({ error: "Upstream error", detail: (err as Error).message });
      }
    },
  } as any);
}

app.use("/v1/auth", serviceProxy(AUTH_SERVICE));
app.use("/v1/payment", serviceProxy(PAYMENT_SERVICE));
app.use("/v1/property", serviceProxy(PROPERTY_SERVICE));
app.use("/v1/user", serviceProxy(USER_SERVICE));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use((_req, res) => res.status(404).json({ error: "Not found" }));

app.listen(4000, () => {
  console.log("Gateway running on :4000");
});
