"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const redis_1 = require("./redis");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Node API app is running on port ${PORT}`);
});
// Middleware authenticateToken
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader;
    if (!token)
        return res.sendStatus(401);
    /*const { email } = req.body as { email: string };
    const verifyToken = await redis.hget(email, "token");*/
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, email) => {
        if (err)
            return res.sendStatus(403);
        res.locals.email = email;
        next();
    });
};
// Middleware rate limit
const rateLimitCheck = async (req, res, next) => {
    const { text } = req.body;
    const { email } = res.locals.email;
    const rateLimit = 500;
    const words = text.split(" ");
    const userCount = await redis_1.redis.hget(email, "count");
    const wordLeftBeforeLimit = rateLimit - Number(userCount);
    if (Number(userCount) + words.length > rateLimit) {
        res
            .status(402)
            .send(`Payment Required, you still have ${wordLeftBeforeLimit} words to use for free`);
    }
    else {
        next();
    }
};
// Middleware  interval word reset
const timeIntervalChecking = async (req, res, next) => {
    const { email } = res.locals.email;
    const userTime = await redis_1.redis.hget(email, "time");
    resetCount(Number(userTime), email);
    next();
};
// request Token
app.post("/api/token", async (req, res) => {
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
// request justify api
app.post("/api/justify", authenticateToken, timeIntervalChecking, rateLimitCheck, (req, res) => {
    const { text } = req.body;
    const { email } = res.locals.email;
    res.type("txt");
    let response = justifyText(text, 80, email);
    res.status(200).send(response);
});
// Justify function
const justifyText = (text, maxLength, email) => {
    const words = text.split(" ");
    let currentLine = "";
    const lines = [];
    for (let i = 0; i < words.length; i++) {
        if (currentLine.length + words[i].length + 1 <= maxLength) {
            currentLine += (currentLine.length === 0 ? "" : " ") + words[i];
        }
        else {
            lines.push(currentLine);
            currentLine = words[i];
        }
    }
    lines.push(currentLine);
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const AmountOfWordInline = line.split(" ");
        let numberOfCharacterInLine = maxLength - line.length;
        let justifyLine = "";
        for (let j = 0; j < AmountOfWordInline.length; j++) {
            let word = AmountOfWordInline[j];
            if (numberOfCharacterInLine > 0) {
                justifyLine += word + "  ";
                numberOfCharacterInLine -= 1;
            }
            else {
                justifyLine += word + " ";
            }
        }
        lines[i] = justifyLine;
    }
    redis_1.redis.hincrby(email, "count", words.length);
    return lines.join("\n");
};
// Update at a certain time
const resetCount = (userTime, userEmail) => {
    const now = new Date();
    const lastUpdate = new Date(userTime);
    const interval = 60000; //24 * 60 * 60 * 1000;
    const numberOfInterval = (now.getTime() - lastUpdate.getTime()) / interval;
    const updatedTime = interval * Math.floor(numberOfInterval) + lastUpdate.getTime();
    const result = now.getTime() - lastUpdate.getTime() - interval;
    if (result >= 0) {
        const updateUserTime = redis_1.redis.hset(userEmail, "time", new Date(updatedTime).toString(), "count", 0);
        return updateUserTime;
    }
};
//# sourceMappingURL=server.js.map