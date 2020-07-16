import { Schema, model, Document } from "mongoose";

export interface IAdmin extends Document {
  email: string;
  password: string;
}

const admin = new Schema<IAdmin>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export const AdminModel = model<IAdmin>("Admin", admin);
