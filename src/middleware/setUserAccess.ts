import { JwtService, UserPayload } from "../services/jwtService";
import { NextFunction, Request, Response } from "express";

const authSplit = (headerAuth: string) => {
  return headerAuth.split(" ");
};

export const getToken = (headerAuth?: string): string => {
  if (!headerAuth) return "";
  const parts = headerAuth.split(" ");
  return parts.length === 2 ? parts[1] : "";
};

const isBearerToken = (authorization: string): boolean => {
  return authorization.startsWith("Bearer ");
};

export const setUserAccess = async (
  req: Request,
  res: Response,
  next: NextFunction,
  jwtService: JwtService
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const decoded = await jwtService.validateToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      console.error("JWT verification failed:", error);
      return res.status(401).json({ message: "Unauthorized" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};
