const express = require("express");
const {
  getOverview,
  getTour,
  login,
  signup,
  getMe,
  updateUserData,
} = require("../controllers/viewsController");
const { isLoggedIn, protectRoute } = require("../controllers/authController");
const { createBookingCheckout } = require("../controllers/bookingController");

const router = express.Router();

router.get("/", createBookingCheckout, isLoggedIn, getOverview);
router.get("/tour/:slug", isLoggedIn, getTour);
router.get("/login", isLoggedIn, login);
router.get("/signup", isLoggedIn, signup);
router.get("/me", protectRoute, getMe);
router.post("/submit-user-data", protectRoute, updateUserData);

module.exports = router;
