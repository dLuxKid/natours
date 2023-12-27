const express = require("express");
const {
  getAllTours,
  addNewTour,
  getTourById,
  updateTour,
  deleteTour,
  checkId,
  checkBody,
} = require("../controllers/tourController");

const router = express.Router();

router.param("id", checkId);

router.route("/").get(getAllTours).post(checkBody, addNewTour);
router.route("/:id").get(getTourById).patch(updateTour).delete(deleteTour);

module.exports = router;
