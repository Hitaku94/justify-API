import {
  justifyTextController,
  justifyText,
} from "../../controllers/justifyText";
import { Request, Response } from "express";

describe("Express route /justify", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let verifyMock: jest.Mock;

  beforeEach(() => {
    verifyMock = jest.fn();
    (justifyText as jest.Mock) = verifyMock;
    req = {
      body: {
        text: "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum",
      },
    } as Partial<Request>;
    res = {
      locals: { email: { email: "mock@gmail.com" } },
      type: jest.fn(),
      status: jest.fn(),
      send: jest.fn(),
    } as Partial<Response>;
  });

  it("should respond with a justified text", () => {
    const responseSend = verifyMock.mockReturnValue("Justified text");
    res.status = jest.fn().mockReturnValue({ send: responseSend });
    justifyTextController(req as Request, res as Response);

    expect(res.type).toHaveBeenCalledWith("txt");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(responseSend).toHaveBeenCalledWith("Justified text");
    expect(verifyMock).toHaveBeenCalledWith(
      "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum",
      80,
      "mock@gmail.com"
    );
  });

  afterEach(() => {
    (justifyText as jest.Mock).mockRestore();
  });
});
