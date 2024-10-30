import { body, ValidationChain } from "express-validator";

export class EventRequest {
  
  static create(): ValidationChain[] {
    return [
      body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email must be valid"),
      body("body").notEmpty().withMessage("Body is required"),
      body("date")
        .isISO8601()
        .withMessage("Date must be a valid ISO 8601 date"),
    ];
  }

  
  static update(): ValidationChain[] {
    return [
      body("id").notEmpty().withMessage("ID is required"),
      ...this.create(),
    ];
  }
}
