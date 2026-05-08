const express = require("express");

const {
  getContributions,
  addContribution,
} = require("../controllers/contributions");

const router = express.Router();

router.get("/:locationId", getContributions);
router.post("/", addContribution);

module.exports = router;
