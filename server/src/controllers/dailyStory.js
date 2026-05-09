const locations = require("../data/locations.json");

function getDayOfYear() {
  const now = new Date();

  const start = new Date(now.getFullYear(), 0, 0);

  const diff =
    now -
    start +
    (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;

  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

async function getDailyStory(req, res, next) {
  try {
    if (!locations.length) {
      return res.status(404).json({
        success: false,
        message: "No locations found",
      });
    }

    const day = getDayOfYear();

    const location = locations[day % locations.length];

    const fact =
      location.facts?.length > 0
        ? location.facts[day % location.facts.length]
        : null;

    res.status(200).json({
      success: true,
      data: {
        locationSlug: location.slug,
        title: location.title,
        fact,
        image: location.coverImage,
        period: location.period,
        shortDescription: location.shortDescription,
        link: `/location/${location.slug}`,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDailyStory,
};