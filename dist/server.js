"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
//import { redis } from "./redis";
//import jwt from "jsonwebtoken";
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;
exports.app.listen(PORT, () => {
    console.log(`Node API app is running on port ${PORT}`);
});
// Middleware authenticateToken
/*
const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader;
  if (!token) return res.sendStatus(401);

  /*const { email } = req.body as { email: string };
  const verifyToken = await redis.hget(email, "token");

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, email) => {
    if (err) return res.sendStatus(403);
    res.locals.email = email;
    next();
  });
};

// Middleware rate limit

export const rateLimitCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { text } = req.body as { text: string };
  const { email } = res.locals.email as { email: string };
  const rateLimit: number = 500;
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

// Middleware  interval word reset

const timeIntervalChecking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = res.locals.email as { email: string };
  const userTime = (await redis.hget(email, "time")) as string;
  resetCount(userTime, email);
  next();
};

// request Token

app.post("/api/token", async (req: Request, res: Response) => {
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
});

// request justify api

app.post(
  "/api/justify",
  authenticateToken,
  timeIntervalChecking,
  rateLimitCheck,
  (req: Request, res: Response) => {
    const { text } = req.body as { text: string };
    const { email } = res.locals.email as { email: string };
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

const resetCount = (userTime: string, userEmail: string) => {
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
      new Date(updatedTime).toString(),
      "count",
      0
    );

    return updateUserTime;
  }
};
*/
//# sourceMappingURL=server.js.map