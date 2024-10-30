import { Schema, model, Types, Document } from "mongoose";

export interface IUserLogin extends Document {
  user: Types.ObjectId; 
  token: string; 
  status: string; 
  timestamp: Date; 
}

const userLoginSchema = new Schema<IUserLogin>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
    token: { type: String, required: true }, 
    status: { type: String, required: true }, 
    timestamp: { type: Date, required: true }, 
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const UserLogin = model<IUserLogin>("UserLogin", userLoginSchema);
