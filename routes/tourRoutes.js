const express = require("express");
const {
  getAllTours,
  addNewTour,
  getTourById,
  updateTour,
  deleteTour,
  checkBody,
  popularTours,
} = require("../controllers/tourController");

const router = express.Router();

router.route("/").get(getAllTours).post(addNewTour);
router.route("/popular-tours").get(popularTours, getAllTours);
router
  .route("/:id")
  .get(checkBody, getTourById)
  .patch(checkBody, updateTour)
  .delete(deleteTour);

module.exports = router;
