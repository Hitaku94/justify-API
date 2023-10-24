"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("../redis");
const authenticateToken_1 = require("../middlewares/authenticateToken");
const resetLimitInterval_1 = require("../middlewares/resetLimitInterval");
const rateLimit_1 = require("../middlewares/rateLimit");
const server_1 = require("../server");
server_1.app.post("/api/justify", authenticateToken_1.authenticateToken, resetLimitInterval_1.timeIntervalChecking, rateLimit_1.rateLimitCheck, (req, res) => {
    const { text } = req.body;
    const { email } = res.locals.email;
    res.type("txt");
    let response = justifyText(text, 80, email);
    res.status(200).send(response);
});
// Justify text logic
const justifyText = (text, maxLength, email) => {
    const words = text.split(" ");
    let currentLine = "";
    const lines = [];
    for (let i = 0; i < words.length; i++) {
        if (currentLine.length + words[i].length + 1 <= maxLength) {
            currentLine += (currentLine.length === 0 ? "" : " ") + words[i];
        }
        else {
            lines.push(currentLine);
            currentLine = words[i];
        }
    }
    lines.push(currentLine);
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const AmountOfWordInline = line.split(" ");
        let numberOfCharacterInLine = maxLength - line.length;
        let justifyLine = "";
        for (let j = 0; j < AmountOfWordInline.length; j++) {
            let word = AmountOfWordInline[j];
            if (numberOfCharacterInLine > 0) {
                justifyLine += word + "  ";
                numberOfCharacterInLine -= 1;
            }
            else {
                justifyLine += word + " ";
            }
        }
        lines[i] = justifyLine;
    }
    redis_1.redis.hincrby(email, "count", words.length);
    return lines.join("\n");
};
//# sourceMappingURL=justify.routes.js.map