import { Request, Response, NextFunction } from "express";
import { redis } from "../config/redis";

export const timeIntervalChecking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = res.locals.email as { email: string };
  const userTime = (await redis.hget(email, "time")) as string;
  resetCount(userTime, email);
  next();
};

const resetCount = (userTime: string, userEmail: string) => {
  const now = new Date();
  const lastUpdate = new Date(userTime);
  const interval: number = 60000; //24 * 60 * 60 * 1000 for 24hours;
  const numberOfInterval: number =
    (now.getTime() - lastUpdate.getTime()) / interval;
  const updatedTime: number =
    interval * Math.floor(numberOfInterval) + lastUpdate.getTime();

  const result: number = now.getTime() - lastUpdate.getTime() - interval;

  if (result >= 0) {
    const updateUserTime = redis.hset(
      userEmail,
      "time",
      new Date(updatedTime).toString(),
      "count",
      0
    );

    return updateUserTime;
  }
};
