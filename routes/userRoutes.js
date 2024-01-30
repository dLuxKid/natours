const express = require("express");

const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  updateUserDetails,
  setUserInactive,
  getMe,
} = require("../controllers/userController");

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protectRoute,
  restrictTo,
  logout,
} = require("../controllers/authController");

const router = express.Router();

router.get("/logout", logout);
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);

router.use(protectRoute); // allows the rest of the routes to be protected instead of putting protectRoute in each of the routes

router.get("/me", getMe, getUser);
router.patch("/update-user", updateUserDetails);
router.patch("/update-password", updatePassword);
router.delete("/delete", setUserInactive);

router.use(restrictTo("admin")); // all routes below can only be accessed by admin accounts

router.get("/", getAllUsers);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
