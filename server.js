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
