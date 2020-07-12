"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const user = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: String,
    address: String,
    resetToken: String,
    resetTokenExp: Date,
    resetTokenIsVerified: Boolean
});
exports.UserModel = mongoose_1.model("User", user);
const comment = new mongoose_1.Schema({
    text: {
        type: String,
        required: true,
    },
    commenter: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    news: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "News",
    },
});
exports.CommentModel = mongoose_1.model("Comment", comment);
