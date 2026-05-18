const blockedWords = require("../config/blockedWords");

function normalizeText(value) {
  return String(value || "").trim();
}

function countLinks(text) {
  const matches = String(text || "").match(
    /\b(?:https?:\/\/)?(?:www\.)?[a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s]*)?/gi
  );

  return matches ? matches.length : 0;
}

function containsHtmlOrScript(text) {
  return /<[^>]*>|script|javascript:|onerror=|onclick=/gi.test(
    String(text || "")
  );
}

function hasRepeatedChars(text) {
  return /(.)\1{7,}/.test(String(text || ""));
}

function hasBlockedWord(text) {
  const normalized = String(text || "").toLowerCase();

  return blockedWords.some((word) =>
    normalized.includes(String(word).toLowerCase())
  );
}

function analyzeText(text) {
  const normalized = normalizeText(text);

  if (!normalized) {
    return {
      isFlagged: false,
      reason: null,
    };
  }

  if (countLinks(normalized) > 1) {
    return {
      isFlagged: true,
      reason: "too_many_links",
    };
  }

  if (containsHtmlOrScript(normalized)) {
    return {
      isFlagged: true,
      reason: "html_or_script_detected",
    };
  }

  if (hasRepeatedChars(normalized)) {
    return {
      isFlagged: true,
      reason: "spam_pattern",
    };
  }

  if (hasBlockedWord(normalized)) {
    return {
      isFlagged: true,
      reason: "blocked_word",
    };
  }

  return {
    isFlagged: false,
    reason: null,
  };
}

function hasBlockedContent(text) {
  return analyzeText(text).isFlagged;
}

module.exports = {
  normalizeText,
  analyzeText,
  hasBlockedContent,
};