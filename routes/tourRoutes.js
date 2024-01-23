const express = require("express");

const {
  getAllTours,
  addNewTour,
  getTourById,
  updateTour,
  deleteTour,
  checkBody,
  popularTours,
  getTourStats,
  getMonthlyPlan,
} = require("../controllers/tourController");
const { protectRoute, restrictTo } = require("../controllers/authController");
const reviewRouter = require("./reviewRoutes");

const router = express.Router();

router.use("/:tourId/reviews", reviewRouter);

router.route("/").get(protectRoute, getAllTours).post(checkBody, addNewTour);
router.route("/popular-tours").get(popularTours, getAllTours);
router.route("/tour-stats").get(getTourStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);
router
  .route("/:id")
  .get(getTourById)
  .patch(checkBody, updateTour)
  .delete(protectRoute, restrictTo("admin", "lead-guide"), deleteTour);

// router
//   .route("/:tourId/review")
//   .post(protectRoute, restrictTo("user"), createReview);

module.exports = router;
