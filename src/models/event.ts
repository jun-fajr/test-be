import { Schema, model, Types } from "mongoose";

export interface IEvent {
  id: Types.ObjectId; 
  email: string; 
  date: Date; 
  body: string; 
}

const eventSchema = new Schema<IEvent>({
  email: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  body: { type: String, required: true, minlength: 1 }, 
});

eventSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret; 
  },
});

export const Event = model<IEvent>("Event", eventSchema);
