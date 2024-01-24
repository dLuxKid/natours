const express = require("express");

const {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  setTourAndUserIds,
  getReview,
} = require("../controllers/reviewController");
const { protectRoute, restrictTo } = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router.use(protectRoute);

router
  .get("/", getAllReviews)
  .post(restrictTo("user", setTourAndUserIds, createReview));

router
  .route("/:id")
  .get(getReview)
  .patch(restrictTo("user", "admin"), updateReview)
  .delete(restrictTo("user", "admin"), deleteReview);

module.exports = router;
