import { NextFunction, Response, Request } from "express";
import { UnauthorizedError } from "../errors/responseErrors";

export const requireAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    return next(
      new UnauthorizedError("User not authorized to access this resource.")
    );
  }

  next();
};
