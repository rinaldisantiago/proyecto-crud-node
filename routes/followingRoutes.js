const express = require("express");
const router = express.Router();
const followingController = require("../controllers/followingController");
const auth = require("../middlewares/authmiddleware");

router.post("/", auth, followingController.follow);

module.exports = router;