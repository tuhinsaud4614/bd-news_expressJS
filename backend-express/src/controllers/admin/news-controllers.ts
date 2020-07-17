import { RequestHandler } from "express";

import { NewsModel } from "../../model/db/news";
import HttpError from "../../model/http-error";

export const getAllNews: RequestHandler = async (_, res, next) => {
  try {
    const allNews = await NewsModel.find().select("-__v").exec();
    if (allNews.length === 0) {
      return next(new HttpError("No newsies found!", 404));
    }
    return res.status(200).json({
      newsies: allNews.map((news) => news.toObject({ getters: true })),
    });
  } catch (e) {
    console.log("Admin side news fetching error & error is", e);
    return next(new HttpError("Something went wrong!", 500));
  }
};

export const removeNews: RequestHandler<{ newsId: string }> = (
  req,
  res,
  next
) => {
  NewsModel.findByIdAndDelete(req.params.newsId, (err, news) => {
    if (err) {
      return next(new HttpError("News not deleted!", 400));
    }
    if (!news) {
      return next(new HttpError("Something went wrong!", 400));
    }
    
    res.status(200).json({
      message: "News deleted successfully!",
      news: news._id,
    });
  });
};
