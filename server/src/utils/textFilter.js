const blockedWords = require("../config/blockedWords");

function hasBlockedContent(text) {
  const normalized = String(text || "").toLowerCase();

  return blockedWords.some((word) => normalized.includes(word));
}

module.exports = {
  hasBlockedContent,
};