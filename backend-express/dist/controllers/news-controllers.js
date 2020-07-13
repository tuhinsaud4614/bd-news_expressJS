"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const newspaper_1 = require("../model/newspaper");
const newspaper_2 = require("../model/newspaper");
const news_1 = require("../model/db/news");
const http_error_1 = __importDefault(require("../model/http-error"));
const convertToNews = (news) => {
    const newNews = new newspaper_2.News(news.newsType, news.newspaperName, news.title, news.link, news.description, news.publishedBy, news.category, news.subTitle, news.publishedDate, news.updatedDate, news.imageUri, news.imageCaption, news.comments.map((cI) => cI.toHexString()), news._id);
    return newNews;
};
exports.allHeadlines = async (_, res, next) => {
    try {
        const allHl = await news_1.NewsModel.find({
            newsType: newspaper_1.NewsType.HEADLINES,
        }).exec();
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
        }).exec();
        res.json({
            data: allTS.map((topStory) => convertToNews(topStory)),
        });
    }
    catch (error) {
        console.log("Fetching top stories  error & error is", error);
        return next(new http_error_1.default("No data found!", 404));
    }
};
exports.topStoriesByDate = async (req, res, next) => {
    const { date } = req.body;
    if (!moment_1.default(+date).isValid()) {
        return next(new http_error_1.default("Invalid date!", 400));
    }
    const checkDate = moment_1.default(+date);
    try {
        const allTS = await news_1.NewsModel.find({
            newsType: newspaper_1.NewsType.TOP_STORIES,
            createdAt: {
                $gte: checkDate.startOf('day').toDate(),
                $lte: checkDate.endOf('day').toDate(),
            },
        }).exec();
        if (allTS.length === 0) {
            return next(new http_error_1.default("No data found!", 404));
        }
        return res.json({
            data: allTS.map((topStory) => convertToNews(topStory)),
        });
    }
    catch (error) {
        console.log("Fetching top stories  error & error is", error);
        return next(new http_error_1.default("No data found!", 404));
    }
};
exports.headlinesByDate = async (req, res, next) => {
    const { date } = req.body;
    if (!moment_1.default(+date).isValid()) {
        return next(new http_error_1.default("Invalid date!", 400));
    }
    const checkDate = moment_1.default(+date);
    try {
        const allTS = await news_1.NewsModel.find({
            newsType: newspaper_1.NewsType.HEADLINES,
            createdAt: {
                $gte: checkDate.startOf('day').toDate(),
                $lte: checkDate.endOf('day').toDate(),
            },
        }).exec();
        if (allTS.length === 0) {
            return next(new http_error_1.default("No data found!", 404));
        }
        return res.json({
            data: allTS.map((topStory) => convertToNews(topStory)),
        });
    }
    catch (error) {
        console.log("Fetching top stories  error & error is", error);
        return next(new http_error_1.default("No data found!", 404));
    }
};
