import { IComment, IUser } from "./../model/db/user";
import { NewsType } from "../model/newspaper";
import { RequestHandler } from "express";

import { News } from "../model/newspaper";
import { Comment } from "../model/comment";
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
    (<IComment[]>news.comments).map(
      (cnt) =>
        new Comment(
          cnt.text,
          {
            name: (<IUser>cnt.commenter).name,
            avatar: (<IUser>cnt.commenter).avatar || "",
          },
          cnt._id
        )
    ),
    news._id
  );
  return newNews;
};

export const allHeadlines: RequestHandler = async (_, res, next) => {
  try {
    const allHl = await NewsModel.find({
      newsType: NewsType.HEADLINES,
    })
      .populate({
        path: "comments",
        populate: { path: "commenter", select: "name avatar" },
      })
      .exec();
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
    })
      .populate({
        path: "comments",
        populate: { path: "commenter", select: "name avatar" },
      })
      .exec();
    res.json({
      data: allTS.map((topStory) => convertToNews(topStory)),
    });
  } catch (error) {
    console.log("Fetching top stories  error & error is", error);
    return next(new HttpError("No data found!", 404));
  }
};
