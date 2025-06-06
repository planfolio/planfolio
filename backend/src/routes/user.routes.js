// src/routes/user.routes.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/user.controller");
const auth = require("../middlewares/auth");
const upload  = require("../middlewares/upload");

// 공개
router.post("/signup", ctrl.signup);
router.post("/login", ctrl.login);

// 인증 필요
router.get("/me", auth, ctrl.me);
router.patch("/me", auth, upload.single('profile'), ctrl.updateMe);
router.patch("/password", auth, ctrl.changePassword);
router.delete("/me", auth, ctrl.deleteMe);

module.exports = router;
