"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatController_1 = require("../controllers/chatController");
const router = (0, express_1.Router)();
const chatController = new chatController_1.ChatController();
router.post("/api/chat", chatController.handleChat.bind(chatController));
exports.default = router;
