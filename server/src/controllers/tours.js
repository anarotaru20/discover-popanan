const tours = require("../data/tours.json");
const locations = require("../data/locations.json");

async function getAllTours(req, res, next) {
  try {
    res.status(200).json({
      success: true,
      count: tours.length,
      data: tours,
    });
  } catch (error) {
    next(error);
  }
}

async function getTourBySlug(req, res, next) {
  try {
    const { slug } = req.params;

    const tour = tours.find((item) => item.slug === slug);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    const stops = tour.stops
      .map((stopSlug) =>
        locations.find((location) => location.slug === stopSlug)
      )
      .filter(Boolean);

    res.status(200).json({
      success: true,
      data: {
        ...tour,
        stopDetails: stops,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllTours,
  getTourBySlug,
};