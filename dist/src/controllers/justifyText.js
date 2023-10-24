"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.justifyText = exports.justifyTextController = void 0;
const redis_1 = require("../config/redis");
const justifyTextController = (req, res) => {
    const { text } = req.body;
    const { email } = res.locals.email;
    res.type("txt");
    let response = (0, exports.justifyText)(text, 80, email);
    res.status(200).send(response);
};
exports.justifyTextController = justifyTextController;
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
exports.justifyText = justifyText;
//# sourceMappingURL=justifyText.js.map