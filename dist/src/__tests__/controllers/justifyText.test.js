"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const justifyText_1 = require("../../controllers/justifyText");
describe("Express route /justify", () => {
    let req;
    let res;
    let verifyMock;
    beforeEach(() => {
        verifyMock = jest.fn();
        justifyText_1.justifyText = verifyMock;
        req = {
            body: {
                text: "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum",
            },
        };
        res = {
            locals: { email: { email: "mock@gmail.com" } },
            type: jest.fn(),
            status: jest.fn(),
            send: jest.fn(),
        };
    });
    it("should respond with a justified text", () => {
        const responseSend = verifyMock.mockReturnValue("Justified text");
        res.status = jest.fn().mockReturnValue({ send: responseSend });
        (0, justifyText_1.justifyTextController)(req, res);
        expect(res.type).toHaveBeenCalledWith("txt");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(responseSend).toHaveBeenCalledWith("Justified text");
        expect(verifyMock).toHaveBeenCalledWith("Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum", 80, "mock@gmail.com");
    });
    afterEach(() => {
        justifyText_1.justifyText.mockRestore();
    });
});
//# sourceMappingURL=justifyText.test.js.map