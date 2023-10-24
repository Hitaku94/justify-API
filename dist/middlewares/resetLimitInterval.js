"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeIntervalChecking = void 0;
const redis_1 = require("../redis");
const timeIntervalChecking = async (req, res, next) => {
    const { email } = res.locals.email;
    const userTime = (await redis_1.redis.hget(email, "time"));
    resetCount(userTime, email);
    next();
};
exports.timeIntervalChecking = timeIntervalChecking;
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
//# sourceMappingURL=resetLimitInterval.js.map