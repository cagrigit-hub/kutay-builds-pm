import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import isAuthed from "../middleware/is-authed";
dotenv.config();

const router = express.Router();

router.post("/", (req, res) => {
  const passkey = req.body.passkey;
  const salt = process.env.SALT as string;
  // hash the password
  const hashedPasskey = bcrypt.hashSync(passkey, salt);
  if (hashedPasskey === process.env.PASSKEY) {
    const token = jwt.sign(
      { passkey: hashedPasskey },
      process.env.JWT_SECRET as string
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    res.send("Success");
  } else {
    res.send("Failure");
  }
});

router.get("/is-authed", (req, res) => {
  const cookies = req.headers.cookie?.split("; ");

  const token = cookies
    ?.find((cookie) => cookie.startsWith("token="))
    ?.split("=")[1];
  if (!token) {
    return res.send(false);
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as {
      passkey: string;
    };
    if (payload.passkey !== process.env.PASSKEY) {
      return res.send(false);
    }
    return res.send(true);
  } catch (error) {
    return res.send(false);
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.send("Success");
});

router.post("/confirm-passkey", isAuthed, (req, res) => {
  const passkey = req.body.passkey;
  const salt = process.env.SALT as string;
  // hash the password
  const hashedPasskey = bcrypt.hashSync(passkey, salt);
  if (hashedPasskey === process.env.PASSKEY) {
    res.send(true);
  } else {
    res.send(false);
  }
});

export default router;
