"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const news_1 = require("../../model/db/news");
const http_error_1 = __importDefault(require("../../model/http-error"));
exports.getAllNews = async (_, res, next) => {
    try {
        const allNews = await news_1.NewsModel.find().select("-__v").exec();
        if (allNews.length === 0) {
            return next(new http_error_1.default("No newsies found!", 404));
        }
        return res.status(200).json({
            newsies: allNews.map((news) => news.toObject({ getters: true })),
        });
    }
    catch (e) {
        console.log("Admin side news fetching error & error is", e);
        return next(new http_error_1.default("Something went wrong!", 500));
    }
};
exports.removeNews = async (req, res, next) => {
    news_1.NewsModel.findByIdAndDelete(req.params.newsId, (err, news) => {
        if (err) {
            return next(new http_error_1.default("News not deleted!", 400));
        }
        if (!news) {
            return next(new http_error_1.default("Something went wrong!", 400));
        }
        res.status(200).json({
            message: "News deleted successfully!",
            news: news._id,
        });
    });
};
