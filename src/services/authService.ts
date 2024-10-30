import { IUser } from "../models/user";
import { UserService } from "./userService";
import { JwtService, UserPayload } from "./jwtService";
import { UserAuthService } from "./userAuthService";
import {
  UnauthorizedError,
  InvalidRequestError,
  NotFoundError,
  InternalServerError,
} from "../errors/responseErrors";
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationDetails {
  email: string;
  password: string;
}

export interface AuthenticationService {
  login(credentials: LoginCredentials): Promise<string>;
  register(details: RegistrationDetails): Promise<IUser>;
  signOut(user: UserPayload, token: string): Promise<boolean>;
}

export class AuthenticationServiceImpl implements AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly userAuthService: UserAuthService
  ) {}

  async login(credentials: LoginCredentials): Promise<string> {
    const user = await this.userService.findByEmail(credentials.email);
    if (!user) {
      throw new UnauthorizedError();
    }
    const isPasswordValid = await this.userService.verifyPassword(
      user,
      credentials.password
    );
    if (!isPasswordValid) {
      throw new UnauthorizedError();
    }
    const token = await this.jwtService.generateToken({
      email: user.email,
    });

    await this.userAuthService.createLogin(user, token);

    return token;
  }

  async register(details: RegistrationDetails): Promise<IUser> {
    try {
      const existingUser = await this.userService.findByEmail(details.email);
      if (existingUser) {
        throw new InvalidRequestError("Email already exists");
      }
      return await this.userService.create(details);
    } catch (error) {
      if (error instanceof InvalidRequestError) {
        throw error;
      } else {
        throw new InternalServerError(
          "An error occurred while registering user"
        );
      }
    }
  }

  async signOut(user: UserPayload, token: string): Promise<boolean> {
    const existingUser = await this.userService.findByEmail(user.email);
    if (!existingUser) {
      throw new NotFoundError("User not found.");
    }
    await this.userAuthService.createLogout(existingUser, token);
    return true;
  }
}
