import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
const proxies = {};

app.use(express.json());

const db = [
  { email: "vineboneto@gmail.com", serviceId: 1, url: "http://localhost:3334" },
  { email: "johndoe@gmail.com", serviceId: 2, url: "http://localhost:3335" },
];

const auth = () => (req, res, next) => {
  const sub = req.body.email;
  const user = db.find((user) => user.email === sub);

  req.locals = {
    ...req?.locals,
    service: user?.url,
    tenancyId: user?.serviceId,
  };

  next();
};

app.post("/login", (req, res) => {
  return res.status(200).send({ email: "vineboneto@gmail.com" });
});

app.all("/api/*", auth(), (req, res, next) => {
  const key = req.locals?.service;

  if (!proxies[key]) {
    proxies[key] = createProxyMiddleware({
      target: req.locals?.service,
      changeOrigin: true,
      pathRewrite: {
        ["^/api"]: "", // remove /api prefix
      },
      onProxyReq: (proxyReq, req) => {
        const body = JSON.stringify(req.body);
        const tenancyId = String(req?.locals?.serviceId);
        proxyReq.setHeader("x-tenancy-id", tenancyId);
        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(body));
        proxyReq.write(body);
        proxyReq.end();
      },
      onError: (err, req, res) => {
        console.error("Erro no proxy:", err);
        res.status(500).json({ message: "Erro no proxy" });
      },
    });
  }

  return proxies[key](req, res, next);
});

app.listen(3333, () => console.log("Gateway is running on port 3333"));
