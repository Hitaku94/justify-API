"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tokenGenerator_1 = require("../controllers/tokenGenerator");
const dotenv_1 = __importDefault(require("dotenv"));
const router = express_1.default.Router();
dotenv_1.default.config();
router.post("/token", tokenGenerator_1.tokenGenerator);
exports.default = router;
//# sourceMappingURL=token.routes.js.map