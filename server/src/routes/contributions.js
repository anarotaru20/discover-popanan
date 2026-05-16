const express = require("express");
const multer = require("multer");

const {
  getContributions,
  addContribution,
} = require("../controllers/contributions");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 3,
  },
});

router.get("/:locationId", getContributions);
router.post("/", upload.array("images", 6), addContribution);

module.exports = router;
