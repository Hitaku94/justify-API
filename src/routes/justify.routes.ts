import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { timeIntervalChecking } from "../middlewares/resetLimitInterval";
import { rateLimitCheck } from "../middlewares/rateLimit";
import { justifyTextController } from "../controllers/justifyText";
const router = express.Router();

router.post(
  "/justify",
  authenticateToken,
  timeIntervalChecking,
  rateLimitCheck,
  justifyTextController
);

export default router;
