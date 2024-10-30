import { IEvent } from "../models/event";
import { Model } from "mongoose";
import { MailerSendService } from "./mailerService";
import { InvalidRequestError } from "../errors/responseErrors";

export interface EventCreatePayload {
  email: string;
  date: Date;
  body: string;
}

export interface EventUpdatePayload {
  id: string;
  email: string;
  date: Date;
  body: string;
}

export interface EventService {
  paginate(): Promise<IEvent[]>;
  create(payload: EventCreatePayload): Promise<IEvent>;
  update(payload: EventUpdatePayload): Promise<IEvent>;
  findOne(id: string): Promise<IEvent | null>;
  delete(id: string): Promise<IEvent>;
  sendEmail(id: string): Promise<IEvent>;
}

export class EventServiceImpl implements EventService {
  constructor(
    private readonly eventModel: Model<IEvent>,
    private readonly mailService: MailerSendService
  ) {}

  async paginate(): Promise<IEvent[]> {
    return this.eventModel.find();
  }

  async create(payload: EventCreatePayload): Promise<IEvent> {
    const event = new this.eventModel(payload);
    return await event.save();
  }

  async update(payload: EventUpdatePayload): Promise<IEvent> {
    const event = await this.eventModel.findById(payload.id);
    if (!event) {
      throw new InvalidRequestError("Event not found");
    }

    
    Object.assign(event, {
      body: payload.body,
      date: payload.date,
      email: payload.email,
    });

    return await event.save();
  }

  async findOne(id: string): Promise<IEvent | null> {
    return this.eventModel.findById(id);
  }

  async delete(id: string): Promise<IEvent> {
    const event = await this.eventModel.findById(id);
    if (!event) {
      throw new InvalidRequestError("Event not found");
    }

    await event.deleteOne();
    return event;
  }

  async sendEmail(id: string): Promise<IEvent> {
    const event = await this.eventModel.findById(id);
    if (!event) {
      throw new InvalidRequestError("Event not found");
    }

    await this.mailService.sendEmail({
      recipient: {
        name: event.email.split("@")[0],
        email: event.email,
      },
      subject: "Hi, salam kenal",
      htmlContent: event.body,
    });

    return event;
  }
}
