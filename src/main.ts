import express, { Express } from "express";
import dotenv from "dotenv";
import passport from "passport";
import cors from "cors";
import "express-async-errors";

import { connectDB } from "./database/mongoose";
import { authRouteSetup } from "./routes/authRoutes";
import { eventRouteSetup } from "./routes/eventRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { NotFoundError } from "./errors/responseErrors";

import { AuthControllerImpl } from "./controllers/authController";
import { EventControllerImpl } from "./controllers/eventController";
import { UserService } from "./services/userService";
import { UserAuthService } from "./services/userAuthService";
import { AuthenticationServiceImpl } from "./services/authService";
import { PasswordService } from "./services/passwordService";
import { JwtServiceImpl } from "./services/jwtService";
import { EventServiceImpl } from "./services/eventService";
import { MailerSendService } from "./services/mailerService";
import { MailerSend } from "mailersend";

import { User } from "./models/user";
import { UserLogin } from "./models/userLogin";
import { Event } from "./models/event";
import { Request, Response, NextFunction } from "express";

dotenv.config();

const {
  PORT = 8080,
  MONGODB_URL = "mongodb://localhost:27017/test1",

  JWT_SECRET = "",
  ACCESS_TOKEN_MAILER_SEND = "",
  MAIL_SENDER_NAME = "",
  ALLOWED_ORIGIN = "",
  MAIL_SENDER_EMAIL = "",
} = process.env;

const initializeServer = async () => {
  await connectDB(MONGODB_URL);

  const app: Express = express();
  app.use(cors());
  app.use(
    cors({
      origin: "http://localhost:3000",

      credentials: true,
    })
  );

  app.use(express.json());
  app.use(passport.initialize());

  const jwtService = new JwtServiceImpl(JWT_SECRET);
  const passwordService = new PasswordService();
  const userService = new UserService(User, passwordService);
  const userAuthService = new UserAuthService(UserLogin);
  const authService = new AuthenticationServiceImpl(
    userService,
    jwtService,
    userAuthService
  );
  const authController = new AuthControllerImpl(authService);

  const mailerSend = new MailerSend({ apiKey: ACCESS_TOKEN_MAILER_SEND });
  const mailService = new MailerSendService(
    mailerSend,
    MAIL_SENDER_NAME,
    MAIL_SENDER_EMAIL
  );
  const eventService = new EventServiceImpl(Event, mailService);
  const eventController = new EventControllerImpl(eventService);

  authRouteSetup(app, authController, jwtService);
  eventRouteSetup(app, eventController, jwtService);

  app.all("*", (req, res, next) => {
    const error = new NotFoundError();
    next(error);
  });

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    const statusCode = err.status || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({ error: { message: message } });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

initializeServer().catch(console.error);
