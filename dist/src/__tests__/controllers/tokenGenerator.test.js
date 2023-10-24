"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tokenGenerator_1 = require("../../controllers/tokenGenerator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = require("../../config/redis");
describe("Express route /token", () => {
    let req;
    let res;
    let verifyMock;
    let verifyMockhset;
    beforeEach(() => {
        verifyMock = jest.fn();
        verifyMockhset = jest.fn();
        jsonwebtoken_1.default.sign = verifyMock;
        redis_1.redis.hset = verifyMockhset;
        req = {
            body: {
                email: "mock@gmail.com",
            },
        };
        res = {
            status: jest.fn(),
            json: jest.fn(),
        };
    });
    it("should generate a status code 200 and a signed token", async () => {
        verifyMock.mockReturnValue("mockedAccessToken");
        verifyMockhset.mockResolvedValue("OK");
        const responseSend = jest.fn();
        res.status = jest.fn().mockReturnValue({ json: responseSend });
        await (0, tokenGenerator_1.tokenGenerator)(req, res);
        expect(verifyMock).toHaveBeenCalledWith({ email: "mock@gmail.com" }, expect.any(String));
        expect(res.status).toHaveBeenCalledWith(200);
        expect(responseSend).toHaveBeenCalledWith({
            email: "mock@gmail.com",
            accessToken: "mockedAccessToken",
        });
        expect(verifyMockhset).toHaveBeenCalledWith("mock@gmail.com", {
            time: expect.any(Date),
            count: 0,
            email: "mock@gmail.com",
        });
    });
});
//# sourceMappingURL=tokenGenerator.test.js.map