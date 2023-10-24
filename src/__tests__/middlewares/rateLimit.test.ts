import { rateLimitCheck } from "../../middlewares/rateLimit";
import { Request, Response, NextFunction } from "express";
import { redis } from "../../config/redis";

describe("rate limit Middleware", () => {
  let verifyMock: jest.Mock;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    verifyMock = jest.fn();
    (redis.hget as jest.Mock) = verifyMock;
    req = {
      body: {
        text: "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum",
      },
    } as Partial<Request>;
    res = { locals: { email: "mock@gmail.com" } } as Partial<Response>;
    next = jest.fn() as jest.Mock;
  });

  it("should send a status code 402 if the number of words is higher than the limit", async () => {
    verifyMock.mockResolvedValue(4995);
    const responseSend = jest.fn();
    res.status = jest.fn().mockReturnValue({ send: responseSend });

    await rateLimitCheck(req as Request, res as Response, next as NextFunction);
    expect(res.status).toHaveBeenCalledWith(402);
    expect(responseSend).toHaveBeenCalledWith(
      "Payment Required, you still have 5 words to use for free"
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next() if the number of words do not reach the limit", async () => {
    verifyMock.mockResolvedValue(400);

    await rateLimitCheck(req as Request, res as Response, next as NextFunction);
    expect(next).toHaveBeenCalled();
  });

  afterEach(() => {
    (redis.hget as jest.Mock).mockRestore();
  });
});
