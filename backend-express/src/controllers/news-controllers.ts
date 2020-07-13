import { RequestHandler } from "express";
import { Types } from "mongoose";
import moment from "moment";

import { NewsType } from "../model/newspaper";
import { News } from "../model/newspaper";
import { NewsModel, INews } from "../model/db/news";
import HttpError from "../model/http-error";

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

export const topStoriesByDate: RequestHandler = async (req, res, next) => {
  const { date } = <{ date: string }>req.body;

  if (!moment(+date).isValid()) {
    return next(new HttpError("Invalid date!", 400));
  }
  const checkDate = moment(+date);
  try {
    const allTS = await NewsModel.find({
      newsType: NewsType.TOP_STORIES,
      createdAt: {
        $gte: checkDate.startOf('day').toDate(),
        $lte: checkDate.endOf('day').toDate(),
      },
    }).exec();

    if (allTS.length === 0) {
      return next(new HttpError("No data found!", 404));
    }

    return res.json({
      data: allTS.map((topStory) => convertToNews(topStory)),
    });
  } catch (error) {
    console.log("Fetching top stories  error & error is", error);
    return next(new HttpError("No data found!", 404));
  }
};

export const headlinesByDate: RequestHandler = async (req, res, next) => {
  const { date } = <{ date: string }>req.body;

  if (!moment(+date).isValid()) {
    return next(new HttpError("Invalid date!", 400));
  }
  const checkDate = moment(+date);
  try {
    const allTS = await NewsModel.find({
      newsType: NewsType.HEADLINES,
      createdAt: {
        $gte: checkDate.startOf('day').toDate(),
        $lte: checkDate.endOf('day').toDate(),
      },
    }).exec();

    if (allTS.length === 0) {
      return next(new HttpError("No data found!", 404));
    }

    return res.json({
      data: allTS.map((topStory) => convertToNews(topStory)),
    });
  } catch (error) {
    console.log("Fetching top stories  error & error is", error);
    return next(new HttpError("No data found!", 404));
  }
};
