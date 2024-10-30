import { Express, NextFunction, Request, Response } from "express";
import { JwtService } from "../services/jwtService";
import { setUserAccess } from "../middleware/setUserAccess";
import { requireAuthMiddleware } from "../middleware/requireAuthMiddleware";
import { EventController } from "../controllers/eventController";
import { validationRequest } from "../middleware/validationRequest";
import { EventRequest } from "../request/eventRequest";

export const eventRouteSetup = (
  app: Express,
  eventController: EventController,
  jwtService: JwtService
) => {
  const validateAuth = [
    (req: Request, res: Response, next: NextFunction) => {
      return setUserAccess(req, res, next, jwtService);
    },
    requireAuthMiddleware,
  ];

  app.post(
    "/api/event",
    validateAuth,
    EventRequest.create(),
    validationRequest,
    (req: Request, res: Response) => {
      return eventController.create(req, res);
    }
  );

  app.put(
    "/api/event",
    validateAuth,
    EventRequest.update(),
    validationRequest,
    (req: Request, res: Response) => {
      return eventController.update(req, res);
    }
  );

  app.get("/api/event", validateAuth, (req: Request, res: Response) => {
    return eventController.paginate(req, res);
  });

  app.get("/api/event/:id", validateAuth, (req: Request, res: Response) => {
    return eventController.findOne(req, res);
  });

  app.post(
    "/api/event/send-email/:id",
    validateAuth,
    (req: Request, res: Response) => {
      return eventController.sendEmail(req, res);
    }
  );

  app.delete("/api/event/:id", validateAuth, (req: Request, res: Response) => {
    return eventController.deleteOne(req, res);
  });
};
