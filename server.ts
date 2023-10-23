import express, { Request, Response, NextFunction, Application } from "express";
import { types } from "util";
const redis = require("./redis");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Node API app is running on port ${PORT}`);
});

// Middleware authenticateToken

const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header["authorization"];
  const token = authHeader;
  if (!token) return res.sendStatus(401);

  /*const { email } = req.body as { email: string };
  const verifyToken = await redis.hget(email, "token");*/

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err: Error, email: string) => {
      if (err) return res.sendStatus(403);
      //req.email = email;
      next();
    }
  );
};

// Middleware rate limit

const rateLimitCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, text } = req.body as { email: string; text: string };
  const rateLimit: number = 500;
  const words = text.split(" ");
  const userCount: number = await redis.hget(email, "count");

  const wordLeftBeforeLimit: number = rateLimit - userCount;

  if (userCount + words.length > rateLimit) {
    res
      .status(402)
      .send(
        `Payment Required, you still have ${wordLeftBeforeLimit} words to use for free`
      );
  } else {
    next();
  }
};

// Middleware  interval word reset

const timeIntervalChecking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body as { email: string };
  const userTime: number = await redis.hget(email, "time");
  resetCount(userTime, email);
  next();
};

// request Token

type User = {
  count: number;
  token: string;
  email: string;
  time: Date;
};

app.post("/api/token", async (req: Request, res: Response) => {
  const now = new Date();
  const userEmail: string = req.body.email;
  const email = { email: userEmail };

  const accessToken: string = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET);
  res.status(200).json({ email: userEmail, accessToken: accessToken });

  try {
    const response: User = await redis.hset(userEmail, {
      count: 0,
      token: accessToken,
      email: userEmail,
      time: now,
    });

    return response;
  } catch (error) {
    console.log(error, "this is an error");
  }
});

// request justify api

app.post(
  "/api/justify",
  authenticateToken,
  timeIntervalChecking,
  rateLimitCheck,
  (req: Request, res: Response) => {
    const { text, email } = req.body as { text: string; email: string };
    res.type("txt");

    let response = justifyText(text, 80, email);
    res.status(200).send(response);
  }
);

// Justify function

const justifyText = (text: string, maxLength: number, email: string) => {
  const words = text.split(" ");
  let currentLine = "";
  const lines: string[] = [];

  for (let i = 0; i < words.length; i++) {
    if (currentLine.length + words[i].length + 1 <= maxLength) {
      currentLine += (currentLine.length === 0 ? "" : " ") + words[i];
    } else {
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
      } else {
        justifyLine += word + " ";
      }
    }
    lines[i] = justifyLine;
  }
  redis.hincrby(email, "count", words.length);
  return lines.join("\n");
};

// Update at a certain time

const resetCount = (userTime: number, userEmail: string) => {
  const now = new Date();
  const lastUpdate = new Date(userTime);
  const interval: number = 60000; //24 * 60 * 60 * 1000;
  const numberOfInterval: number =
    (now.getTime() - lastUpdate.getTime()) / interval;
  const updatedTime: number =
    interval * Math.floor(numberOfInterval) + lastUpdate.getTime();

  const result: number = now.getTime() - lastUpdate.getTime() - interval;

  if (result >= 0) {
    const updateUserTime = redis.hset(
      userEmail,
      "time",
      new Date(updatedTime),
      "count",
      0
    );

    return updateUserTime;
  }
};
