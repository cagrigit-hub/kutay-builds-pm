import type { Request, Response, NextFunction } from "express";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("err", err.message);
  res.status(500).send("Internal Serverless Error");
};

export default errorHandler;
