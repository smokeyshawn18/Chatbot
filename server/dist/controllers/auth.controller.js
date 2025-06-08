"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerController = exports.loginController = void 0;
const loginController = (req, res) => {
    const { username, password } = req.body;
    res.json({ message: `Logged in as ${username}` });
};
exports.loginController = loginController;
const registerController = (req, res) => {
    const { username, password } = req.body;
    res.json({ message: `Registered user ${username}` });
};
exports.registerController = registerController;
