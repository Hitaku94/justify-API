"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenGenerator = void 0;
const redis_1 = require("../config/redis");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const tokenGenerator = async (req, res) => {
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
};
exports.tokenGenerator = tokenGenerator;
//# sourceMappingURL=tokenGenerator.js.map