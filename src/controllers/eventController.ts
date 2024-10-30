import { Request, Response } from "express";
import { EventService } from "../services/eventService";
import {
  eventPaginateResponse,
  eventResponse,
} from "../helpers/eventControllerResponse";
import { NotFoundError } from "../errors/responseErrors";

export interface EventController {
  paginate(req: Request, res: Response): Promise<void>;
  create(req: Request, res: Response): Promise<void>;
  update(req: Request, res: Response): Promise<void>;
  findOne(req: Request, res: Response): Promise<void>;
  deleteOne(req: Request, res: Response): Promise<void>;
  sendEmail(req: Request, res: Response): Promise<void>;
}

export class EventControllerImpl implements EventController {
  constructor(private readonly eventService: EventService) {}

  private async executeAction(
    res: Response,
    action: () => Promise<any>,
    successCode: number = 200
  ): Promise<void> {
    try {
      const result = await action();
      res.status(successCode).json(result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      res.status(error instanceof NotFoundError ? 404 : 500).json({
        message: errorMessage,
      });
    }
  }

  async paginate(req: Request, res: Response): Promise<void> {
    await this.executeAction(res, async () => {
      const events = await this.eventService.paginate();
      return eventPaginateResponse(events);
    });
  }

  async create(req: Request, res: Response): Promise<void> {
    await this.executeAction(
      res,
      async () => {
        const event = await this.eventService.create(req.body);
        return eventResponse(event);
      },
      201
    );
  }

  async update(req: Request, res: Response): Promise<void> {
    await this.executeAction(res, async () => {
      const event = await this.eventService.update(req.body);
      return eventResponse(event);
    });
  }

  async findOne(req: Request, res: Response): Promise<void> {
    await this.executeAction(res, async () => {
      const event = await this.eventService.findOne(req.params.id);
      if (!event) throw new NotFoundError("Event not found");
      return eventResponse(event);
    });
  }

  async deleteOne(req: Request, res: Response): Promise<void> {
    await this.executeAction(
      res,
      async () => {
        const event = await this.eventService.delete(req.params.id);
        return eventResponse(event);
      },
      201
    );
  }

  async sendEmail(req: Request, res: Response): Promise<void> {
    await this.executeAction(res, async () => {
      const event = await this.eventService.sendEmail(req.params.id);
      return eventResponse(event);
    });
  }
}
