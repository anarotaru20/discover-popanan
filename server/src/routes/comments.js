const express = require("express");

const {
  getComments,
  addComment,
} = require("../controllers/comments");

const router = express.Router();

router.get("/:locationId", getComments);
router.post("/", addComment);

module.exports = router;