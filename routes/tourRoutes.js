const express = require("express");

const {
  getAllTours,
  addNewTour,
  getTourById,
  updateTour,
  deleteTour,
  popularTours,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
} = require("../controllers/tourController");
const { protectRoute, restrictTo } = require("../controllers/authController");
const reviewRouter = require("./reviewRoutes");

const router = express.Router();

router.use("/:tourId/reviews", reviewRouter);

router.get("/", getAllTours);
router.get("/popular-tours", popularTours, getAllTours);
router.get("/tour-stats", getTourStats);
router.get(
  "/monthly-plan/:year",
  restrictTo("admin", "lead-guide", "guide"),
  getMonthlyPlan
);

router.route("/:id").get(getTourById);

router
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(getToursWithin);

router.use(protectRoute, restrictTo("admin", "lead-guide"));

router.post("/", addNewTour);
router.patch("/:id", updateTour);
router.delete("/:id", deleteTour);

module.exports = router;
