import { NewsType } from "../model/newspaper";
import { RequestHandler } from "express";

import { News } from "../model/newspaper";
import { NewsModel, INews } from "../model/db/news";
import HttpError from "../model/http-error";
import { Types } from "mongoose";

const convertToNews = (news: INews) => {
  const newNews = new News(
    news.newsType,
    news.newspaperName,
    news.title,
    news.link,
    news.description,
    news.publishedBy,
    news.category,
    news.subTitle,
    news.publishedDate,
    news.updatedDate,
    news.imageUri,
    news.imageCaption,
    (news.comments as Types.ObjectId[]).map((cI) => cI.toHexString()),
    news._id
  );
  return newNews;
};

export const allHeadlines: RequestHandler = async (_, res, next) => {
  try {
    const allHl = await NewsModel.find({
      newsType: NewsType.HEADLINES,
    }).exec();
    res.json({
      data: allHl.map((headline) => convertToNews(headline)),
    });
  } catch (error) {
    console.log("Fetching Headline error & error is", error);
    return next(new HttpError("No data found!", 404));
  }
};

export const allTopStories: RequestHandler = async (_, res, next) => {
  try {
    const allTS = await NewsModel.find({
      newsType: NewsType.TOP_STORIES,
    }).exec();

    res.json({
      data: allTS.map((topStory) => convertToNews(topStory)),
    });
  } catch (error) {
    console.log("Fetching top stories  error & error is", error);
    return next(new HttpError("No data found!", 404));
  }
};
