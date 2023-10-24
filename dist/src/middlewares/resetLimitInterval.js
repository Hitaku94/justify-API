"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetCount = exports.timeIntervalChecking = void 0;
const redis_1 = require("../config/redis");
const timeIntervalChecking = async (req, res, next) => {
    const { email } = res.locals.email;
    const userTime = (await redis_1.redis.hget(email, "time"));
    (0, exports.resetCount)(userTime, email);
    next();
};
exports.timeIntervalChecking = timeIntervalChecking;
const resetCount = (userTime, userEmail) => {
    const now = new Date();
    const lastUpdate = new Date(userTime);
    const interval = 86400000; //86400000; // 24hours;
    const numberOfInterval = (now.getTime() - lastUpdate.getTime()) / interval;
    const updatedTime = interval * Math.floor(numberOfInterval) + lastUpdate.getTime();
    const result = now.getTime() - lastUpdate.getTime() - interval;
    if (result >= 0) {
        const updateUserTime = redis_1.redis.hset(userEmail, "time", new Date(updatedTime).toString(), "count", 0);
        return updateUserTime;
    }
};
exports.resetCount = resetCount;
//# sourceMappingURL=resetLimitInterval.js.map