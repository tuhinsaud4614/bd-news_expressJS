import { Schema, model, Document, Types } from "mongoose";

import { IComment, IFavorite } from "./user";
import { NewspaperName } from "./../newspaper";
import { NewsType } from "../newspaper";

export interface INews extends Document {
  newsType: NewsType;
  newspaperName: NewspaperName;
  title: string;
  link: string;
  category?: string;
  subTitle?: string;
  publishedBy?: string;
  publishedDate?: string;
  updatedDate?: string;
  imageUri?: string;
  imageCaption?: string;
  description: string[];
  comments: IComment[] | Types.ObjectId[];
  favorites: IFavorite[] | Types.ObjectId[];
  createdAt: Date;
}

// create Schema
const news = new Schema<INews>({
  newsType: {
    type: String,
    required: true,
  },
  newspaperName: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  category: String,
  subTitle: String,
  publishedBy: String,
  publishedDate: String,
  updatedDate: String,
  imageUri: String,
  imageCaption: String,
  description: {
    type: [String],
    default: [],
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  favorites: [
    {
      type: Schema.Types.ObjectId,
      ref: "Favorite",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const NewsModel = model<INews>("News", news);
