import { body, ValidationChain } from "express-validator";

export class AuthRequest {
  
  static signin(): ValidationChain[] {
    return [
      body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email must be valid"),
      body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),
    ];
  }

  
  static signup(): ValidationChain[] {
    return this.signin();
  }
}
