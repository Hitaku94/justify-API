"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("../redis");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const server_1 = require("../server");
dotenv_1.default.config();
server_1.app.post("/api/token", async (req, res) => {
    const now = new Date();
    const userEmail = req.body.email;
    const email = { email: userEmail };
    const accessToken = jsonwebtoken_1.default.sign(email, `${process.env.ACCESS_TOKEN_SECRET}`);
    res.status(200).json({ email: userEmail, accessToken: accessToken });
    const response = await redis_1.redis.hset(userEmail, {
        time: now,
        count: 0,
        email: userEmail,
    });
    return response;
});
//# sourceMappingURL=token.routes.js.map