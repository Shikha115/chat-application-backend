import { NextFunction, Request, Response } from "express";



// Error middleware
export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  let message = err instanceof Error ? err.message : "Internal Server Error";

  console.log(message, "errorMiddleware");

  res.status(statusCode).json({
    success: false,
    message,
  });
};

