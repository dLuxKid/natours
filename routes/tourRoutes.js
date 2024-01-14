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
const { protectRoute } = require("../controllers/authController");

const router = express.Router();

router.route("/").get(protectRoute, getAllTours).post(checkBody, addNewTour);
router.route("/popular-tours").get(popularTours, getAllTours);
router.route("/tour-stats").get(getTourStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);
router
  .route("/:id")
  .get(getTourById)
  .patch(checkBody, updateTour)
  .delete(deleteTour);

module.exports = router;
