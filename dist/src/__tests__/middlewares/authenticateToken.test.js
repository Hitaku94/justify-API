"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authenticateToken_1 = require("../../middlewares/authenticateToken");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
describe("authenticateToken Middleware", () => {
    let verifyMock;
    let req;
    let res;
    let next;
    beforeEach(() => {
        verifyMock = jest.fn();
        jsonwebtoken_1.default.verify = verifyMock;
        req = { headers: {} };
        res = { sendStatus: jest.fn() };
        next = jest.fn();
    });
    it("should send a status code 401 if no token has been found", async () => {
        await (0, authenticateToken_1.authenticateToken)(req, res, next);
        expect.assertions(2);
        expect(res.sendStatus).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });
    it("should return a status code 403 if an invalid token is provided", async () => {
        req.headers = { authorization: "invalidToken" };
        verifyMock.mockImplementation((token, secret, callback) => {
            callback(new Error("Invalid token"), null);
        });
        await (0, authenticateToken_1.authenticateToken)(req, res, next);
        expect.assertions(2);
        expect(res.sendStatus).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });
    it("should call next() if a valid token is provided", async () => {
        req.headers = { authorization: "ValidToken" };
        res = {
            locals: {},
        };
        verifyMock.mockImplementation((token, secret, callback) => {
            callback(null, "mock@gmail.com");
        });
        await (0, authenticateToken_1.authenticateToken)(req, res, next);
        expect(next).toHaveBeenCalled();
        if (res.locals) {
            expect(res.locals.email).toBe("mock@gmail.com");
        }
    });
    afterEach(() => {
        jsonwebtoken_1.default.verify.mockRestore();
    });
});
//# sourceMappingURL=authenticateToken.test.js.map