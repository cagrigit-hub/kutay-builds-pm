import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const isAuthed = (req: Request, res: Response, next: NextFunction) => {
  const cookies = req.headers.cookie?.split("; ");

  let token = cookies
    ?.find((cookie) => cookie.startsWith("token="))
    ?.split("=")[1];
  const bearer = req.headers.authorization?.split(" ")[1];
  if (!token && bearer) {
    token = bearer;
  }
  if (!token) {
    res.status(401).send("Unauthorized");
    return;
  }
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      passkey: string;
    };
  } catch (error) {
    res.status(401).send("Unauthorized");
    return;
  }
  if (decoded && decoded.passkey === process.env.PASSKEY) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};

export default isAuthed;
