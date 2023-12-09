import "express-async-errors";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import auth from "./routes/auth";
import password from "./routes/password";
import isAuthed from "./middleware/is-authed";
import errorHandler from "./middleware/error-handler";
dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/auth", auth);
app.use("/password", password);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/protected", isAuthed, (req, res) => {
  res.send("Protected");
});

app.use(errorHandler);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port " + process.env.PORT || 3000);
});
