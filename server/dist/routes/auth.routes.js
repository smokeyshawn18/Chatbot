"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
router.get("/login", auth_controller_1.loginController);
router.get("/register", auth_controller_1.registerController);
exports.default = router;
