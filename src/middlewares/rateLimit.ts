import { Request, Response, NextFunction } from "express";
import { redis } from "../config/redis";

export const rateLimitCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { text } = req.body as { text: string };
  const { email } = res.locals.email as { email: string };
  const rateLimit: number = 8000;
  const words: string[] = text.split(" ");
  const userCount = await redis.hget(email, "count");

  const wordLeftBeforeLimit: number = rateLimit - Number(userCount);

  if (Number(userCount) + words.length > rateLimit) {
    res
      .status(402)
      .send(
        `Payment Required, you still have ${wordLeftBeforeLimit} words to use for free`
      );
  } else {
    next();
  }
};
