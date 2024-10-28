const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const auth = require("../middlewares/authmiddleware");
const upload = require("../middlewares/uploadMiddleware");


router.post("/register", usuarioController.register);
router.put("/me", auth, upload.single('avatar'), usuarioController.update);
router.get("/list", usuarioController.list);

module.exports = router;