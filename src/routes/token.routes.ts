import express from "express";
import { tokenGenerator } from "../controllers/tokenGenerator";
import dotenv from "dotenv";
const router = express.Router();

dotenv.config();

router.post("/token", tokenGenerator);

export default router;
