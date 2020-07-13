"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const http_error_1 = __importDefault(require("../../model/http-error"));
const user_1 = require("../../model/db/user");
const news_1 = require("../../model/db/news");
const validator_1 = __importDefault(require("validator"));
exports.setFavorite = async (req, res, next) => {
    let { newsId } = req.body;
    newsId = newsId.trim();
    if (validator_1.default.isEmpty(newsId)) {
        return next(new http_error_1.default("News can't be empty!", 422));
    }
    try {
        const user = await user_1.UserModel.findById(req.userId);
        const news = await news_1.NewsModel.findById(newsId);
        if (user && news) {
            const alreadyExistInFavorite = await user_1.FavoriteModel.findOne({
                news: newsId,
                user: req.userId,
            });
            if (alreadyExistInFavorite) {
                return res.status(201).json({
                    message: "News listed as favorite successfully!",
                    comment: alreadyExistInFavorite._id,
                });
            }
            const sess = await mongoose_1.startSession();
            sess.startTransaction();
            const resFavorite = await new user_1.FavoriteModel({
                user: user,
                news: news,
            }).save();
            news.favorites.push(resFavorite._id);
            await news.save();
            sess.commitTransaction();
            return res.status(201).json({
                message: "News listed as favorite successfully!",
                comment: resFavorite._id,
            });
        }
        else {
            return next(new http_error_1.default("User Or News not Found!", 404));
        }
    }
    catch (error) {
        console.log("News listed as favorite error & error is", error);
        return next(new http_error_1.default("News listed as favorite failed!", 400));
    }
};
exports.removeFavorite = async (req, res, next) => {
    let { newsId } = req.body;
    newsId = newsId.trim();
    if (validator_1.default.isEmpty(newsId)) {
        return next(new http_error_1.default("News can't be empty!", 422));
    }
    try {
        const favorite = await user_1.FavoriteModel.findOne({
            news: newsId,
            user: req.userId,
        });
        const news = await news_1.NewsModel.findById(newsId);
        if (favorite && news) {
            const newsFavoriteIndex = news.favorites.indexOf(favorite._id);
            news.favorites.splice(newsFavoriteIndex, 1);
            const sess = await mongoose_1.startSession();
            sess.startTransaction();
            await favorite.remove();
            await news.save();
            sess.commitTransaction();
            return res.status(200).json({
                message: "News unlisted as favorite successfully!",
            });
        }
        else {
            return next(new http_error_1.default("Something went wrong!", 404));
        }
    }
    catch (error) {
        console.log("News unlisted as favorite error & error is", error);
        return next(new http_error_1.default("News unlisted as favorite failed!", 400));
    }
};
