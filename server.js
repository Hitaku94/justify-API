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

// request Token

app.post("/api/token", async (req, res) => {
  const userEmail = req.headers.email;
  const email = { email: userEmail };

  const accessToken = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accessToken: accessToken });

  if (!(await redis.get(userEmail[0]))) {
    await redis.hset(userEmail, {
      count: 0,
      token: accessToken,
      email: userEmail,
    });
  }
});

// request justify api

app.post("/api/justify", authenticateToken, (req, res) => {
  const { text, email } = req.body;
  res.type("txt");

  let response = justifyText(text, 80, email);
  res.send(response);
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

// Justify function

const justifyText = async (text, maxLength, email) => {
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
      console.log(word);
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
  //tawait redis.hset(email, "count", words.length);
  return lines.join("\n");
};
