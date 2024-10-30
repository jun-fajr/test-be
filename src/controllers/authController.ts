import { Request, Response } from "express";
import { AuthenticationService } from "../services/authService";
import {
  logoutResponse,
  signInResponse,
  signUpResponse,
} from "../helpers/authControllerResponse";
import { getToken } from "../middleware/setUserAccess";
import { UserAuthenticatedRequest } from "../types/userRequest";

export interface AuthController {
  signIn(req: Request, res: Response): Promise<void>;
  signUp(req: Request, res: Response): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;
}

export class AuthControllerImpl implements AuthController {
  constructor(private authService: AuthenticationService) {}

  private async executeAction(
    res: Response,
    action: () => Promise<any>,
    successCode: number = 200
  ): Promise<void> {
    try {
      const data = await action();
      res.status(successCode).json(data);
    } catch (error) {
      res.status(500).json({ message: "An error occurred", details: error });
    }
  }

  async signIn(req: Request, res: Response): Promise<void> {
    await this.executeAction(res, async () => {
      const token = await this.authService.login(req.body);
      return signInResponse(token);
    });
  }

  async signUp(req: Request, res: Response): Promise<void> {
    await this.executeAction(
      res,
      async () => {
        const newUser = await this.authService.register(req.body);
        return signUpResponse(newUser);
      },
      201
    );
  }

  async logout(req: UserAuthenticatedRequest, res: Response): Promise<void> {
    const token = getToken(req.headers.authorization);

    await this.executeAction(
      res,
      async () => {
        const logoutSuccess = await this.authService.signOut(req.user!, token);
        return logoutResponse(logoutSuccess);
      },
      201
    );
  }
}
