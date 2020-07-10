"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const user_1 = require("../../model/db/user");
const news_1 = require("../../model/db/news");
const http_error_1 = __importDefault(require("../../model/http-error"));
// Get all comments for specific news
exports.allComments = async (req, res, next) => {
    let comments = [];
    try {
        comments = await user_1.CommentModel.find({ news: req.params.newsId })
            .select("-__v")
            .populate("commenter", "name avatar")
            .exec();
    }
    catch (err) {
        console.log("Error in [allComments-controller]", err);
        return next(new http_error_1.default("Something went wrong!", 500));
    }
    if (comments.length === 0) {
        return res.status(404).json({
            message: "No Comments Found!",
        });
    }
    res.status(200).json({
        data: comments,
    });
};
exports.createComment = async (req, res, next) => {
    const { text, newsId } = req.body;
    try {
        const user = await user_1.UserModel.findById(req.userId);
        const news = await news_1.NewsModel.findById(newsId);
        if (user && news) {
            const sess = await mongoose_1.startSession();
            sess.startTransaction();
            const resComment = await new user_1.CommentModel({
                text: text,
                commenter: user,
                news: news,
            }).save();
            news.comments.push(resComment._id);
            await news.save();
            sess.commitTransaction();
            res.status(201).json({
                message: "Comment created successfully!",
                comment: resComment._id,
            });
        }
        else {
            return next(new http_error_1.default("User Or News not Found!", 404));
        }
    }
    catch (error) {
        console.log("Create comment error & error is", error);
        return next(new http_error_1.default("Comment creation failed!", 400));
    }
};
exports.editComment = async (req, res, next) => {
    const { text } = req.body;
    user_1.CommentModel.findOneAndUpdate({ _id: req.params.id, commenter: req.userId }, { text: text }, (err, updatedComment) => {
        if (err) {
            return next(new http_error_1.default("Comment not updated!", 401));
        }
        if (!updatedComment) {
            return next(new http_error_1.default("Comment not exists!", 404));
        }
        res.json({
            message: "Comment updated successfully!",
            updateComment: updatedComment._id,
        });
    });
};
exports.deleteComment = async (req, res, next) => {
    user_1.CommentModel.findOneAndDelete({ _id: req.params.id, commenter: req.userId }, (err, deletedComment) => {
        if (err) {
            return next(new http_error_1.default("Comment not deleted!", 400));
        }
        if (!deletedComment) {
            return next(new http_error_1.default("Comment not exists!", 400));
        }
        res.json({
            message: "Comment deleted successfully!",
            updateComment: deletedComment._id,
        });
    });
};
