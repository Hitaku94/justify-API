"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resetLimitInterval_1 = require("../../middlewares/resetLimitInterval");
const redis_1 = require("../../config/redis");
describe("time interval checking middleware", () => {
    let verifyMock;
    let verifyMockhset;
    let req;
    let res;
    let next;
    beforeEach(() => {
        verifyMock = jest.fn();
        verifyMockhset = jest.fn();
        redis_1.redis.hget = verifyMock;
        redis_1.redis.hset = verifyMockhset;
        req = {};
        res = {
            locals: { email: { email: "mock@gmail.com" } },
        };
        next = jest.fn();
    });
    it("should call next() without resetting the count if the time interval is not exceeded", async () => {
        const now = new Date();
        const userTime = new Date(now.getTime() - 30 * 1000).toString();
        verifyMock.mockResolvedValue(userTime);
        await (0, resetLimitInterval_1.timeIntervalChecking)(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(verifyMockhset).not.toHaveBeenCalled();
    });
    it("should call next() while resetting the count if the time interval is exceeded", async () => {
        const now = new Date();
        const userTime = new Date(now.getTime() - 60 * 1000).toString();
        verifyMock.mockResolvedValue(userTime);
        await (0, resetLimitInterval_1.timeIntervalChecking)(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(verifyMockhset).toHaveBeenCalledWith("mock@gmail.com", "time", expect.any(String), "count", 0);
    });
    afterEach(() => {
        redis_1.redis.hget.mockRestore();
        redis_1.redis.hset.mockRestore();
    });
});
//# sourceMappingURL=resetLimitInterval.test.js.map