"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const newspaper_1 = require("../model/newspaper");
const newspaper_2 = require("../model/newspaper");
const comment_1 = require("../model/comment");
const news_1 = require("../model/db/news");
const http_error_1 = __importDefault(require("../model/http-error"));
const convertToNews = (news) => {
    const newNews = new newspaper_2.News(news.newsType, news.newspaperName, news.title, news.link, news.description, news.publishedBy, news.category, news.subTitle, news.publishedDate, news.updatedDate, news.imageUri, news.imageCaption, news.comments.map((cnt) => new comment_1.Comment(cnt.text, {
        name: cnt.commenter.name,
        avatar: cnt.commenter.avatar || "",
    }, cnt._id)), news._id);
    return newNews;
};
exports.allHeadlines = async (_, res, next) => {
    try {
        const allHl = await news_1.NewsModel.find({
            newsType: newspaper_1.NewsType.HEADLINES,
        })
            .populate({
            path: "comments",
            populate: { path: "commenter", select: "name avatar" },
        })
            .exec();
        res.json({
            data: allHl.map((headline) => convertToNews(headline)),
        });
    }
    catch (error) {
        console.log("Fetching Headline error & error is", error);
        return next(new http_error_1.default("No data found!", 404));
    }
};
exports.allTopStories = async (_, res, next) => {
    try {
        const allTS = await news_1.NewsModel.find({
            newsType: newspaper_1.NewsType.TOP_STORIES,
        })
            .populate({
            path: "comments",
            populate: { path: "commenter", select: "name avatar" },
        })
            .exec();
        res.json({
            data: allTS.map((topStory) => convertToNews(topStory)),
        });
    }
    catch (error) {
        console.log("Fetching top stories  error & error is", error);
        return next(new http_error_1.default("No data found!", 404));
    }
};
