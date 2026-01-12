import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFile extends Document {
  owner: Types.ObjectId;
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  path: string;
}

const fileSchema = new Schema<IFile>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    originalName: { type: String, required: true },
    storedName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    path: { type: String, required: true },
  },
  { timestamps: true }
);

export const FileModel = mongoose.model<IFile>("File", fileSchema);
