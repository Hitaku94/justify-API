import express, { Application } from "express";
import routerJustify from "./routes/justify.routes";
import routerToken from "./routes/token.routes";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Node API app is running on port ${PORT}`);
});

app.use("/api", routerJustify);
app.use("/api", routerToken);

// this middleware runs whenever requested page is not available
app.use((req, res, next) => {
  res.status(404).json({ errorMessage: "This route does not exist" });
});
