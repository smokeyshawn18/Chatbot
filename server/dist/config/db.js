"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = promise_1.default.createPool({
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"), // 👈 Add this line
    user: process.env.DB_USER || "chatbot_user",
    password: process.env.DB_PASSWORD || "secure_password",
    database: process.env.DB_NAME || "college_chatbot",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
exports.default = pool;
