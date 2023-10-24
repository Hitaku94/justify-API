import { tokenGenerator } from "../../controllers/tokenGenerator";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { redis } from "../../config/redis";

describe("Express route /token", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let verifyMock: jest.Mock;
  let verifyMockhset: jest.Mock;

  beforeEach(() => {
    verifyMock = jest.fn();
    verifyMockhset = jest.fn();
    (jwt.sign as jest.Mock) = verifyMock;
    (redis.hset as jest.Mock) = verifyMockhset;
    req = {
      body: {
        email: "mock@gmail.com",
      },
    } as Partial<Request>;
    res = {
      status: jest.fn(),
      json: jest.fn(),
    } as Partial<Response>;
  });

  it("should generate a status code 200 and a signed token", async () => {
    verifyMock.mockReturnValue("mockedAccessToken");
    verifyMockhset.mockResolvedValue("OK");
    const responseSend = jest.fn();
    res.status = jest.fn().mockReturnValue({ json: responseSend });
    await tokenGenerator(req as Request, res as Response);

    expect(verifyMock).toHaveBeenCalledWith(
      { email: "mock@gmail.com" },
      expect.any(String)
    );
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
