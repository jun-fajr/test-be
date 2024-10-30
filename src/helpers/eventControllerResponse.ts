import { IEvent } from "../models/event";

interface ApiResponse<T> {
  data: T;
  message?: string;
}

export function eventPaginateResponse(events: IEvent[]): ApiResponse<IEvent[]> {
  return {
    data: events,
  };
}

export function eventResponse(event: IEvent): ApiResponse<IEvent> {
  return {
    data: event,
  };
}
