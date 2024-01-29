const express = require("express");
const {
  getOverview,
  getTour,
  login,
  signup,
} = require("../controllers/viewsController");

const router = express.Router();

router.get("/", getOverview);
router.get("/login", login);
router.get("/signup", signup);
router.get("/tour/:slug", getTour);

module.exports = router;
