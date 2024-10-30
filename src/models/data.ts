import mongoose, { Document, Schema } from "mongoose";

export interface DataDocument extends Document {
  email: string;
  createdAt: Date;
}

const DataSchema: Schema<DataDocument> = new Schema({
  email: { type: String, required: true, trim: true }, 
  createdAt: { type: Date, default: Date.now, required: true }, 
});

export const DataModel = mongoose.model<DataDocument>("Data", DataSchema);
