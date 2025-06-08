"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = void 0;
const getAllUsers = (req, res) => {
    res.json([{ id: 1, name: "User One" }]);
};
exports.getAllUsers = getAllUsers;
