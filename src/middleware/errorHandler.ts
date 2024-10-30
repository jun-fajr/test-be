import { NextFunction, Response, Request } from "express";
import { CustomError } from "../errors/responseErrors";

export const errorHandler = (
  error: Error | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  if (error instanceof CustomError) {
    return res.status(error.statusCode).json({
      errors: error.serializeErrors(),
    });
  }

  console.error(error);

  return res.status(500).json({
    errors: [{ message: "Something went wrong" }],
  });
};
