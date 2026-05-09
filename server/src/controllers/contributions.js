const {
  getContributionsByLocation,
  createContribution,
} = require("../repo/contributions");

const blockedWords = require("../config/blockedWords");

function hasBlockedContent(text) {
  const normalized = String(text || "").toLowerCase();

  return blockedWords.some((word) => normalized.includes(word));
}

function normalizeText(value) {
  return String(value || "").trim();
}

async function getContributions(req, res, next) {
  try {
    const { locationId } = req.params;

    if (!locationId) {
      return res.status(400).json({
        success: false,
        message: "Location id is required",
      });
    }

    const contributions = await getContributionsByLocation(locationId);

    res.status(200).json({
      success: true,
      count: contributions.length,
      data: contributions,
    });
  } catch (error) {
    next(error);
  }
}

async function addContribution(req, res, next) {
  try {
    const location_id = normalizeText(req.body.location_id);
    const name = normalizeText(req.body.name);
    const type = normalizeText(req.body.type);
    const message = normalizeText(req.body.message);
    const source_url = normalizeText(req.body.source_url);
    const image_url = normalizeText(req.body.image_url);

    if (!location_id || !name || !type || !message) {
      return res.status(400).json({
        success: false,
        message: "Location id, name, type and message are required",
      });
    }

    const allowedTypes = [
      "amintire personala",
      "corectie",
      "sursa noua",
      "fotografie veche",
      "mesaj pentru viitor",
    ];

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contribution type",
      });
    }

    if (name.length > 40) {
      return res.status(400).json({
        success: false,
        message: "Name must have maximum 40 characters",
      });
    }

    if (message.length < 5 || message.length > 1500) {
      return res.status(400).json({
        success: false,
        message: "Message must have between 5 and 1500 characters",
      });
    }

    const is_flagged =
      hasBlockedContent(name) ||
      hasBlockedContent(message) ||
      hasBlockedContent(source_url);

    const contribution = await createContribution({
      location_id,
      name,
      type,
      message,
      source_url: source_url || null,
      image_url: image_url || null,
      is_flagged,
    });

    res.status(201).json({
      success: true,
      message: is_flagged
        ? "Contribution was submitted but flagged by automatic moderation"
        : "Contribution added successfully",
      data: contribution,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getContributions,
  addContribution,
};
