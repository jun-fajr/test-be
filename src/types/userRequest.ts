
import { Request } from "express";

export interface UserPayload {
  email: string; 
}

export interface UserAuthenticatedRequest extends Request {
  user?: UserPayload; 
}
