"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("./../../model/db/user");
const http_error_1 = __importDefault(require("../../model/http-error"));
exports.getAllComments = async (_, res, next) => {
    try {
        const allComments = await user_1.CommentModel.find().select("-__v").exec();
        if (allComments.length === 0) {
            return next(new http_error_1.default("No comments found!", 404));
        }
        return res.status(200).json({
            comments: allComments.map((comment) => comment.toObject({ getters: true })),
        });
    }
    catch (e) {
        console.log("Admin side comments fetching error & error is", e);
        return next(new http_error_1.default("Something went wrong!", 500));
    }
};
exports.removeComment = (req, res, next) => {
    user_1.CommentModel.findByIdAndDelete(req.params.commentId, (err, comment) => {
        if (err) {
            return next(new http_error_1.default("Comment not deleted!", 400));
        }
        if (!comment) {
            return next(new http_error_1.default("Something went wrong!", 400));
        }
        res.status(200).json({
            message: "Comment deleted successfully!",
            comment: comment._id,
        });
    });
};
