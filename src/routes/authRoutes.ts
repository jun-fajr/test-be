import { AuthController } from "../controllers/authController";
import { Express, Request, Response, NextFunction } from "express";
import { AuthRequest } from "../request/authRequest";
import { setUserAccess } from "../middleware/setUserAccess";
import { requireAuthMiddleware } from "../middleware/requireAuthMiddleware";
import { JwtService } from "../services/jwtService";
import { validationRequest } from "../middleware/validationRequest";

export const authRouteSetup = (
  app: Express,
  authController: AuthController,
  jwtService: JwtService
) => {
  
  app.post(
    "/api/auth/login",
    AuthRequest.signin(),
    validationRequest,
    async (req: Request, res: Response) => {
      
      console.log("Received login request:", req.body); 
      await authController.signIn(req, res); 
    }
  );

  
  app.post(
    "/api/auth/register",
    AuthRequest.signup(),
    validationRequest,
    async (req: Request, res: Response) => {
      
      console.log("Received registration request:", req.body); 
      await authController.signUp(req, res); 
    }
  );

  
  app.post(
    "/api/auth/logout",
    async (req: Request, res: Response, next: NextFunction) => {
      
      console.log("Received logout request:", req.headers.authorization); 
      await setUserAccess(req, res, next, jwtService); 
    },
    requireAuthMiddleware,
    async (req: Request, res: Response) => {
      
      await authController.logout(req, res); 
    }
  );
};
