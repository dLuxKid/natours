const express = require("express");
const {
  getOverview,
  getTour,
  login,
  signup,
} = require("../controllers/viewsController");
const { isLoggedIn } = require("../controllers/authController");

const router = express.Router();

router.use(isLoggedIn);

router.get("/", getOverview);
router.get("/tour/:slug", getTour);
router.get("/login", login);
router.get("/signup", signup);

module.exports = router;
