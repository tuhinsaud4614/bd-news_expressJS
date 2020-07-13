"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// create Schema
const news = new mongoose_1.Schema({
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
    favorites: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Favorite",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
exports.NewsModel = mongoose_1.model("News", news);
