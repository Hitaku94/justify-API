"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const justify_routes_1 = __importDefault(require("./routes/justify.routes"));
const token_routes_1 = __importDefault(require("./routes/token.routes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Node API app is running on port ${PORT}`);
});
app.use("/api", justify_routes_1.default);
app.use("/api", token_routes_1.default);
// this middleware will run when requested page is not available
app.use((req, res, next) => {
    res.status(404).json({ errorMessage: "This route does not exist" });
});
//# sourceMappingURL=server.js.map