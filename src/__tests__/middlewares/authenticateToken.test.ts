import { authenticateToken } from "../../middlewares/authenticateToken";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

describe("authenticateToken Middleware", () => {
  let verifyMock: jest.Mock;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    verifyMock = jest.fn();
    (jwt.verify as jest.Mock) = verifyMock;

    req = { headers: {} };
    res = { sendStatus: jest.fn() };
    next = jest.fn();
  });

  it("should send a status code 401 if no token has been found", async () => {
    await authenticateToken(
      req as Request,
      res as Response,
      next as NextFunction
    );
    expect.assertions(2);
    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("should return a status code 403 if an invalid token is provided", async () => {
    req.headers = { authorization: "invalidToken" };
    verifyMock.mockImplementation((token, secret, callback) => {
      callback(new Error("Invalid token"), null);
    });

    await authenticateToken(
      req as Request,
      res as Response,
      next as NextFunction
    );
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

    await authenticateToken(
      req as Request,
      res as Response,
      next as NextFunction
    );
    expect(next).toHaveBeenCalled();
    if (res.locals) {
      expect(res.locals.email).toBe("mock@gmail.com");
    }
  });

  afterEach(() => {
    (jwt.verify as jest.Mock).mockRestore();
  });
});
