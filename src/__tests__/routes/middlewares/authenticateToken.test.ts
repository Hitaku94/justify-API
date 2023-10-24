import { authenticateToken } from "../../../middlewares/authenticateToken";

const request = {
  headers: {
    authorization: "fake_token",
  },
};

const response = {
  sendStatus: jest.fn((x) => x),
  locals: {
    email: "fake_email",
  },
};

const next = () => {};

it("should send a status code 401 if no token has been found", () => {
  authenticateToken(request, response, next);
});
