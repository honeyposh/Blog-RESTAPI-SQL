const express = require("express");
const router = express.Router();
const { isAuthorized } = require("../middleware/is-auth");
const authController = require("../controllers/authController");
router.post("/signup", authController.signUp);
router.post("/signin", authController.signIn);
router.get("/getme", isAuthorized, authController.userProfile);
router.get("/signout", authController.signOut);
module.exports = router;
