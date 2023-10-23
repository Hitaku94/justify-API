const express = require("express");
const app = express();
const redis = require("./redis");
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
