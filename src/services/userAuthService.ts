import { IUser } from "../models/user";
import { IUserLogin } from "../models/userLogin";
import { Model } from "mongoose";

export interface IUserAuthService {
  logIn(user: IUser, accessToken: string): Promise<IUserLogin>;
  logOut(user: IUser, accessToken: string): Promise<IUserLogin>;
}

export class UserAuthService implements IUserAuthService {
  constructor(private readonly userLoginModel: Model<IUserLogin>) {}
  logIn(user: IUser, accessToken: string): Promise<IUserLogin> {
    throw new Error("Method not implemented.");
  }
  logOut(user: IUser, accessToken: string): Promise<IUserLogin> {
    throw new Error("Method not implemented.");
  }

  private async createUserLoginEntry(
    user: IUser,
    accessToken: string,
    status: "LOGIN" | "LOGOUT"
  ): Promise<IUserLogin> {
    const userLoginEntry = new this.userLoginModel({
      timestamp: new Date(),
      token: accessToken,
      user: user.id, 
      status: status,
    });

    try {
      return await userLoginEntry.save(); 
    } catch (error) {
      console.error("Error saving user login entry:", error);
      throw new Error("Could not create user login entry."); 
    }
  }

  async createLogin(user: IUser, accessToken: string): Promise<IUserLogin> {
    return this.createUserLoginEntry(user, accessToken, "LOGIN");
  }

  async createLogout(user: IUser, accessToken: string): Promise<IUserLogin> {
    return this.createUserLoginEntry(user, accessToken, "LOGOUT");
  }
}
