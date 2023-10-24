import { Request, Response } from "express";
import { redis } from "../config/redis";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const tokenGenerator = async (req: Request, res: Response) => {
  const now = new Date();
  const userEmail: string = req.body.email;
  const email = { email: userEmail };

  const accessToken = jwt.sign(email, `${process.env.ACCESS_TOKEN_SECRET}`);
  res.status(200).json({ email: userEmail, accessToken: accessToken });

  const response = await redis.hset(userEmail, {
    time: now,
    count: 0,
    email: userEmail,
  });

  return response;
};
