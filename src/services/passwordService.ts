import bcrypt from "bcrypt";

export interface IPasswordService {
  hashPassword(password: string): Promise<string>;
  verifyPassword(original: string, hashed: string): Promise<boolean>;
}

export class PasswordService implements IPasswordService {
  private readonly saltRounds: number;

  constructor(saltRounds: number = 12) {
    this.saltRounds = saltRounds;
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async verifyPassword(original: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(original, hashed);
  }
}
