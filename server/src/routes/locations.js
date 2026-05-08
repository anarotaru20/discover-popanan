const express = require("express");

const {
  getAllLocations,
  getLocationBySlug,
} = require("../controllers/locations");

const router = express.Router();

router.get("/", getAllLocations);

router.get("/:slug", getLocationBySlug);

module.exports = router;
