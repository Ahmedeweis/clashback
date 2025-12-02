const express = require("express");
const cors = require("cors");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./swagger");
require("dotenv").config();

const clanRoutes = require("./routes/clanRoutes");
const playerRoutes = require("./routes/playerRoutes");
const warRoutes = require("./routes/warRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
app.use("/api/clan", clanRoutes);
app.use("/api/player", playerRoutes);
app.use("/api/cwl", warRoutes);

// Cache directory setup (moved to utils/apiHelper.js but good to keep the log or check here if needed,
// strictly speaking apiHelper handles it now so we don't need it here, but I'll leave a log)


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is running on http://0.0.0.0:${PORT}`);
  console.log(`� Swagger Docs available at http://0.0.0.0:${PORT}/api-docs`);
});

