const locations = require("../data/locations.json");

async function getAllLocations(req, res, next) {
  try {
    res.status(200).json({
      success: true,
      count: locations.length,
      data: locations,
    });
  } catch (error) {
    next(error);
  }
}

async function getLocationBySlug(req, res, next) {
  try {
    const { slug } = req.params;

    const location = locations.find((item) => item.slug === slug);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    res.status(200).json({
      success: true,
      data: location,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllLocations,
  getLocationBySlug,
};