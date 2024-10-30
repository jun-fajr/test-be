import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../errors/responseErrors";

export const validationRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.error("Validation errors:", errors.array());
    return next(new RequestValidationError(errors.array()));
  }

  next(); 
};
