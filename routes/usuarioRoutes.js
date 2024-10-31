const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const authController = require("../controllers/authController");
const auth = require("../middlewares/authmiddleware");
const upload = require("../middlewares/uploadMiddleware");


router.post("/register", usuarioController.register);
router.get("/", usuarioController.list);
router.post("/login", authController.login);
router.put("/me", auth, upload.single('avatar'), usuarioController.update);

module.exports = router;