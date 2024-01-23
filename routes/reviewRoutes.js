const express = require("express");
const {
  getAllReviews,
  createReview,
} = require("../controllers/reviewController");
const { protectRoute, restrictTo } = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getAllReviews)
  .post(protectRoute, restrictTo("user"), createReview);

module.exports = router;
