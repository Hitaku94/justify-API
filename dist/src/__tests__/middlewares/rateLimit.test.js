"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rateLimit_1 = require("../../middlewares/rateLimit");
const redis_1 = require("../../config/redis");
describe("rate limit Middleware", () => {
    let verifyMock;
    let req;
    let res;
    let next;
    beforeEach(() => {
        verifyMock = jest.fn();
        redis_1.redis.hget = verifyMock;
        req = {
            body: {
                text: "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum",
            },
        };
        res = { locals: { email: "mock@gmail.com" } };
        next = jest.fn();
    });
    it("should send a status code 402 if the number of words is higher than the limit", async () => {
        verifyMock.mockResolvedValue(495);
        const responseSend = jest.fn();
        res.status = jest.fn().mockReturnValue({ send: responseSend });
        await (0, rateLimit_1.rateLimitCheck)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(402);
        expect(responseSend).toHaveBeenCalledWith("Payment Required, you still have 5 words to use for free");
        expect(next).not.toHaveBeenCalled();
    });
    it("should call next() if the number of words do not reach the limit", async () => {
        verifyMock.mockResolvedValue(400);
        await (0, rateLimit_1.rateLimitCheck)(req, res, next);
        expect(next).toHaveBeenCalled();
    });
    afterEach(() => {
        redis_1.redis.hget.mockRestore();
    });
});
//# sourceMappingURL=rateLimit.test.js.map