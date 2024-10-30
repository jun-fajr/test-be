import jwt from "jsonwebtoken";

export interface UserPayload {
  email: string;
}

export interface JwtService {
  generateToken(payload: UserPayload): Promise<string>;
  validateToken(token: string): Promise<UserPayload>;
}

export class JwtServiceImpl implements JwtService {
  constructor(private readonly secretKey: string) {}

  async generateToken(payload: UserPayload): Promise<string> {
    return jwt.sign(payload, this.secretKey, {
      expiresIn: "1h",
    });
  }

  async validateToken(token: string): Promise<UserPayload> {
    return jwt.verify(token, this.secretKey) as UserPayload;
  }
}
