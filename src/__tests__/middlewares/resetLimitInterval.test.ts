import { timeIntervalChecking } from "../../middlewares/resetLimitInterval";
import { Request, Response, NextFunction } from "express";
import { redis } from "../../config/redis";

describe("time interval checking middleware", () => {
  let verifyMock: jest.Mock;
  let verifyMockhset: jest.Mock;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    verifyMock = jest.fn();
    verifyMockhset = jest.fn();
    (redis.hget as jest.Mock) = verifyMock;
    (redis.hset as jest.Mock) = verifyMockhset;
    req = {} as Partial<Request>;
    res = {
      locals: { email: { email: "mock@gmail.com" } },
    } as Partial<Response>;
    next = jest.fn() as NextFunction;
  });

  it("should call next() without resetting the count if the time interval is not exceeded", async () => {
    const now = new Date();
    const userTime = new Date(now.getTime() - 30 * 1000).toString();
    verifyMock.mockResolvedValue(userTime);

    await timeIntervalChecking(
      req as Request,
      res as Response,
      next as NextFunction
    );

    expect(next).toHaveBeenCalled();
    expect(verifyMockhset).not.toHaveBeenCalled();
  });
  it("should call next() while resetting the count if the time interval is exceeded", async () => {
    const now = new Date();
    const userTime = new Date(now.getTime() - 60 * 1000).toString();
    verifyMock.mockResolvedValue(userTime);

    await timeIntervalChecking(
      req as Request,
      res as Response,
      next as NextFunction
    );
    expect(next).toHaveBeenCalled();
    expect(verifyMockhset).toHaveBeenCalledWith(
      "mock@gmail.com",
      "time",
      expect.any(String),
      "count",
      0
    );
  });
  afterEach(() => {
    (redis.hget as jest.Mock).mockRestore();
    (redis.hset as jest.Mock).mockRestore();
  });
});
