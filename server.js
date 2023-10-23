const express = require("express");
const app = express();
const redis = require("./redis");
const jwt = require("jsonwebtoken");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Node API app is running on port ${PORT}`);
});

// Middleware authenticateToken

const authenticateToken = async (req, res, next) => {
  /*const authHeader = req.headers["authorization"];
  const token = authHeader;
  if (!token) return res.sendStatus(401);*/

  const { email } = req.body;
  const verifyToken = await redis.hget(email, "token", function (err, obj) {
    return obj;
  });

  jwt.verify(verifyToken, process.env.ACCESS_TOKEN_SECRET, (err, email) => {
    if (err) return res.sendStatus(403);
    console.log(email, "this is the email");
    req.email = email;
    next();
  });
};

// Middleware rate limit

const rateLimitChecking = async (req, res, next) => {
  const { email } = req.body;
  const rateLimit = 500;

  const userCount = await redis.hget(email, "count");

  if (userCount > rateLimit) {
    res.status(402).send("Payment Required");
  } else {
    next();
  }
};

// request Token

app.post("/api/token", async (req, res) => {
  const userEmail = req.body.email;
  const email = { email: userEmail };

  const accessToken = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET);
  res.status(200).json({ email: userEmail, accessToken: accessToken });

  try {
    const response = await redis.hset(userEmail, {
      count: 0,
      token: accessToken,
      email: userEmail,
    });

    return response;
  } catch (error) {
    console.log(error, "this is an error");
  }
});

// request justify api

app.post("/api/justify", authenticateToken, rateLimitChecking, (req, res) => {
  const { text, email } = req.body;
  res.type("txt");

  let response = justifyText(text, 80, email);
  res.status(200).send(response);
});

// Justify function

const justifyText = (text, maxLength, email) => {
  const words = text.split(" ");
  let currentLine = "";
  const lines = [];

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
      //console.log(word);
      if (numberOfCharacterInLine > 0) {
        justifyLine += word + "  ";
        numberOfCharacterInLine -= 1;
      } else {
        justifyLine += word + " ";
      }
      //console.log(justifyLine);
      //console.log(numberOfCharacterInLine);
    }
    lines[i] = justifyLine;
  }
  redis.hincrby(email, "count", words.length);
  return lines.join("\n");
};
