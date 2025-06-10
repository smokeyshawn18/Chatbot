"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const env_1 = require("./config/env");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use("/api/chat", chatRoutes_1.default);
app.listen(env_1.PORT, () => console.log(`Server running on port ${env_1.PORT}`));
