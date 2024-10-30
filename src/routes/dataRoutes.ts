import { Router, Request, Response } from "express";
import { EventControllerImpl } from "../controllers/eventController";
import { EventServiceImpl } from "../services/eventService";
import { Event } from "@/models/event";
import { MailerSend } from "mailersend"; 
import { MailerSendService } from "../services/mailerService";

const router = Router();

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY || "", 
});

const mailerService = new MailerSendService(
  mailerSend,
  "Your Sender Name",
  "your-email@example.com"
); 

const eventService = new EventServiceImpl(Event, mailerService);
const eventController = new EventControllerImpl(eventService);

router.get("/", (req: Request, res: Response) => {
  return eventController.paginate(req, res); 
});

router.post("/", (req: Request, res: Response) => {
  return eventController.create(req, res); 
});

export default router;
