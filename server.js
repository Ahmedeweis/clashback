// Load .env if present (Node 20.12+); in production env vars can also come from PM2/systemd
try { process.loadEnvFile(); } catch {}

const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./swagger");

const clanRoutes = require("./routes/clanRoutes");
const playerRoutes = require("./routes/playerRoutes");
const warRoutes = require("./routes/warRoutes");

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1); // behind Nginx

// Middlewares
// CORS_ORIGIN: comma-separated list of allowed origins; unset = allow all
const origins = process.env.CORS_ORIGIN?.split(",").map((o) => o.trim()).filter(Boolean);
app.use(cors({ origin: origins?.length ? origins : true }));
app.use(express.json());

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Routes
app.use("/api/clan", clanRoutes);
app.use("/api/player", playerRoutes);
app.use("/api/cwl", warRoutes);

app.use((req, res) => res.status(404).json({ error: "Not found" }));

// Errors thrown from controllers (Express 5 forwards async errors here)
app.use((err, req, res, next) => {
  const status = err.status || (err.name === "TimeoutError" ? 504 : 500);
  res.status(status).json({ error: "Failed to fetch data", details: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0"; // 127.0.0.1 in production (behind Nginx)
const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Server is running on http://${HOST}:${PORT}`);
  console.log(`📚 Swagger Docs available at http://${HOST}:${PORT}/api-docs`);
});

process.on("SIGTERM", () => server.close(() => process.exit(0)));
process.on("SIGINT", () => server.close(() => process.exit(0)));
