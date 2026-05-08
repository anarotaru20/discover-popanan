const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const logger = require("./config/logger");

const locationsRoutes = require("./routes/locations");
const toursRoutes = require("./routes/tours");
const commentsRoutes = require("./routes/comments");
const contributionsRoutes = require("./routes/contributions");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use("/api/locations", locationsRoutes);
app.use("/api/tours", toursRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/contributions", contributionsRoutes);

// Error handling
app.use((req, res) => {
  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  logger.error({
    message: err?.message,
    code: err?.code,
    number: err?.number,
    name: err?.name,
    stack: err?.stack,
    original: err?.originalError?.message,
  });

  res.status(500).json({
    message: err?.message || "Internal server error",
    code: err?.code,
    number: err?.number,
    name: err?.name,
    original: err?.originalError?.message,
  });
});

module.exports = app;
