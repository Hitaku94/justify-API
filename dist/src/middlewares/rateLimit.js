"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimitCheck = void 0;
const redis_1 = require("../config/redis");
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
exports.rateLimitCheck = rateLimitCheck;
//# sourceMappingURL=rateLimit.js.map