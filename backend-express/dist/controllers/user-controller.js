"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const news_1 = require("./../model/db/news");
const user_1 = require("./../model/db/user");
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const http_error_1 = __importDefault(require("../model/http-error"));
exports.createUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const currentUser = await user_1.UserModel.findOne({ email: email });
        if (!currentUser) {
            const hashPassword = await bcryptjs_1.hash(password, 12);
            const resUser = await new user_1.UserModel({
                name: name,
                email: email,
                password: hashPassword,
                avatar: null,
                address: null,
            }).save();
            res.status(201).json({
                message: "User created successfully!",
                user: resUser.name,
            });
        }
        else {
            return next(new http_error_1.default("User already exists!", 400));
        }
    }
    catch (error) {
        console.log("Create user error & error is", error);
        return next(new http_error_1.default("User creation failed!", 401));
    }
};
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const currentUser = await user_1.UserModel.findOne({ email: email });
        if (currentUser) {
            const isMatch = await bcryptjs_1.compare(password, currentUser.password);
            if (!isMatch) {
                return next(new http_error_1.default("Wrong User credentials!", 422));
            }
            else {
                const token = jsonwebtoken_1.sign({
                    name: currentUser.name,
                    email: currentUser.email,
                    id: currentUser._id,
                }, process.env.SECRET_OR_KEY || "supersecret", { expiresIn: "1h" });
                res.status(200).json({
                    token: token,
                    userId: currentUser._id,
                });
            }
        }
        else {
            return next(new http_error_1.default("User Not Found!", 404));
        }
    }
    catch (error) {
        console.log("Create user error & error is", error);
        return next(new http_error_1.default("User creation failed!", 401));
    }
};
exports.createComment = async (req, res, next) => {
    try {
        const { text, newsId } = req.body;
        const user = await user_1.UserModel.findById(req.userId);
        const news = await news_1.NewsModel.findById(newsId);
        if (user && news) {
            const resComment = await new user_1.CommentModel({
                text: text,
                commenter: user,
                news: newsId,
            }).save();
            news.comments.push(resComment._id);
            await news.save();
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
        return next(new http_error_1.default("Comment creation failed!", 401));
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
