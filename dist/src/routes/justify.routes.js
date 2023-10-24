"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticateToken_1 = require("../middlewares/authenticateToken");
const resetLimitInterval_1 = require("../middlewares/resetLimitInterval");
const rateLimit_1 = require("../middlewares/rateLimit");
const justifyText_1 = require("../controllers/justifyText");
const router = express_1.default.Router();
router.post("/justify", authenticateToken_1.authenticateToken, resetLimitInterval_1.timeIntervalChecking, rateLimit_1.rateLimitCheck, justifyText_1.justifyTextController);
exports.default = router;
//# sourceMappingURL=justify.routes.js.map