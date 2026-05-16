const crypto = require("crypto");
const path = require("path");
const supabase = require("../config/supabase");

const {
  getContributionsByLocation,
  createContribution,
} = require("../repo/contributions");

const { analyzeText, normalizeText } = require("../utils/textFilter");

const BUCKET_NAME = "contributions";

function normalizeImageUrls(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((url) => normalizeText(url)).filter(Boolean);
  }

  try {
    const parsedValue = JSON.parse(value);

    if (Array.isArray(parsedValue)) {
      return parsedValue.map((url) => normalizeText(url)).filter(Boolean);
    }
  } catch (error) {
    return [normalizeText(value)].filter(Boolean);
  }

  return [];
}

async function uploadContributionImages(files = []) {
  const imageUrls = [];

  for (const file of files) {
    if (!file.mimetype.startsWith("image/")) {
      throw new Error("Only image files are allowed");
    }

    const extension = path.extname(file.originalname) || ".jpg";
    const fileName = `${crypto.randomUUID()}${extension}`;
    const filePath = `community/${fileName}`;

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    imageUrls.push(data.publicUrl);
  }

  return imageUrls;
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

    const uploadedImageUrls = await uploadContributionImages(req.files || []);
    const bodyImageUrls = normalizeImageUrls(req.body.image_url);
    const image_url = [...bodyImageUrls, ...uploadedImageUrls];

    if (!location_id || !name || !type || !message) {
      return res.status(400).json({
        success: false,
        message: "Location id, name, type and message are required",
      });
    }

    const allowedTypes = [
      "amintire_personala",
      "corectie",
      "sursa_noua",
      "fotografie_veche",
      "mesaj_pentru_viitor",
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

    if (image_url.length > 3) {
      return res.status(400).json({
        success: false,
        message: "You can upload maximum 3 images",
      });
    }

    const nameModeration = analyzeText(name);
    const messageModeration = analyzeText(message);
    const sourceModeration = analyzeText(source_url);

    const moderation = nameModeration.isFlagged
      ? nameModeration
      : messageModeration.isFlagged
        ? messageModeration
        : sourceModeration;

    const is_flagged = moderation.isFlagged;

    const contribution = await createContribution({
      location_id,
      name,
      type,
      message,
      source_url: source_url || null,
      image_url,
      is_flagged,
    });

    res.status(201).json({
      success: true,
      message: is_flagged
        ? "Contribution was submitted but flagged by automatic moderation"
        : "Contribution added successfully",
      moderation,
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
