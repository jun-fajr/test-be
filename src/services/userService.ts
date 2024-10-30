import { IUser } from "../models/user";
import { Model } from "mongoose";
import { LoginCredentials } from "./authService";
import { PasswordService } from "./passwordService";

export interface IUserService {
  findByEmail(email: string): Promise<IUser | null>;
  create(payload: LoginCredentials): Promise<IUser>;
  verifyPassword(user: IUser, passwordOriginal: string): Promise<boolean>;
}

export class UserService implements IUserService {
  constructor(
    private readonly userModel: Model<IUser>,
    private readonly passwordService: PasswordService
  ) {}

  async findByEmail(email: string): Promise<IUser | null> {
    return this.userModel.findOne({ email });
  }

  async create(payload: LoginCredentials): Promise<IUser> {
    const hashedPassword = await this.passwordService.hashPassword(
      payload.password
    );
    const newUser = new this.userModel({
      email: payload.email,
      password: hashedPassword,
    });
    return await newUser.save();
  }

  async verifyPassword(
    user: IUser,
    passwordOriginal: string
  ): Promise<boolean> {
    return this.passwordService.verifyPassword(passwordOriginal, user.password);
  }
}
