const express = require("express");

const {
  getDailyStory,
} = require("../controllers/dailyStory");

const router = express.Router();

router.get("/", getDailyStory);

module.exports = router;