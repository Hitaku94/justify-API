import { Request, Response } from "express";
import { redis } from "../config/redis";

export const justifyTextController = (req: Request, res: Response) => {
  const { text } = req.body as { text: string };
  const { email } = res.locals.email as { email: string };
  res.type("txt");

  let response = justifyText(text, 80, email);
  res.status(200).send(response);
};

export const justifyText = (text: string, maxLength: number, email: string) => {
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
