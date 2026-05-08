const { getCommentsByLocation, createComment } = require("../repo/comments");
const { hasBlockedContent } = require("../utils/textFilter");

function normalizeText(value) {
  return String(value || "").trim();
}

async function getComments(req, res, next) {
  try {
    const { locationId } = req.params;

    if (!locationId) {
      return res.status(400).json({
        success: false,
        message: "Location id is required",
      });
    }

    const comments = await getCommentsByLocation(locationId);

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
}

async function addComment(req, res, next) {
  try {
    const location_id = normalizeText(req.body.location_id);
    const name = normalizeText(req.body.name);
    const message = normalizeText(req.body.message);

    if (!location_id || !name || !message) {
      return res.status(400).json({
        success: false,
        message: "Location id, name and message are required",
      });
    }

    if (name.length > 40) {
      return res.status(400).json({
        success: false,
        message: "Name must have maximum 40 characters",
      });
    }

    if (message.length < 5 || message.length > 700) {
      return res.status(400).json({
        success: false,
        message: "Message must have between 5 and 700 characters",
      });
    }

    const is_flagged = hasBlockedContent(name) || hasBlockedContent(message);

    const comment = await createComment({
      location_id,
      name,
      message,
      is_flagged,
    });

    res.status(201).json({
      success: true,
      message: is_flagged
        ? "Comment was submitted but flagged by automatic moderation"
        : "Comment added successfully",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getComments,
  addComment,
};