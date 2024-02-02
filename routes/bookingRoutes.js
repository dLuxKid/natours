const express = require("express");

const { getCheckoutSession } = require("../controllers/bookingController");
const { protectRoute, restrictTo } = require("../controllers/authController");

const router = express.Router();

router.get("/checkout-session/:tourId", protectRoute, getCheckoutSession);

module.exports = router;
