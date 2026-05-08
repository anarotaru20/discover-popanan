const express = require("express");

const {
  getAllTours,
  getTourBySlug,
} = require("../controllers/tours");

const router = express.Router();

router.get("/", getAllTours);

router.get("/:slug", getTourBySlug);

module.exports = router;