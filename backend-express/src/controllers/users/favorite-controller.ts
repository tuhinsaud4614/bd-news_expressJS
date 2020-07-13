import { RequestHandler } from "express";
import { startSession } from "mongoose";

import HttpError from "../../model/http-error";
import { UserModel, FavoriteModel } from "../../model/db/user";
import { NewsModel } from "../../model/db/news";
import validator from "validator";

export const setFavorite: RequestHandler = async (req, res, next) => {
  let { newsId } = req.body as {
    newsId: string;
  };
  
  newsId = newsId.trim();

  if (validator.isEmpty(newsId)) {
    return next(new HttpError("News can't be empty!", 422));
  }

  try {
    const user = await UserModel.findById(req.userId);
    const news = await NewsModel.findById(newsId);

    if (user && news) {
      const alreadyExistInFavorite = await FavoriteModel.findOne({
        news: newsId,
        user: req.userId,
      });
      if (alreadyExistInFavorite) {
        return res.status(201).json({
          message: "News listed as favorite successfully!",
          comment: alreadyExistInFavorite._id,
        });
      }

      const sess = await startSession();
      sess.startTransaction();

      const resFavorite = await new FavoriteModel({
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
    } else {
      return next(new HttpError("User Or News not Found!", 404));
    }
  } catch (error) {
    console.log("News listed as favorite error & error is", error);
    return next(new HttpError("News listed as favorite failed!", 400));
  }
};

export const removeFavorite: RequestHandler = async (req, res, next) => {
  let { newsId } = req.body as {
    newsId: string;
  };

  newsId = newsId.trim();

  if (validator.isEmpty(newsId)) {
    return next(new HttpError("News can't be empty!", 422));
  }

  try {
    const favorite = await FavoriteModel.findOne({
      news: newsId,
      user: req.userId,
    });
    const news = await NewsModel.findById(newsId);

    if (favorite && news) {
      const newsFavoriteIndex = news.favorites.indexOf(favorite._id);
      news.favorites.splice(newsFavoriteIndex, 1);

      const sess = await startSession();
      sess.startTransaction();
      await favorite.remove();
      await news.save();
      sess.commitTransaction();

      return res.status(200).json({
        message: "News unlisted as favorite successfully!",
      });
    } else {
      return next(new HttpError("Something went wrong!", 404));
    }
  } catch (error) {
    console.log("News unlisted as favorite error & error is", error);
    return next(new HttpError("News unlisted as favorite failed!", 400));
  }
};
