import { IComment } from "../../model/db/user";
import { RequestHandler } from "express";
import { startSession} from "mongoose";
import validator from "validator";

import { UserModel, CommentModel } from "../../model/db/user";
import { NewsModel } from "../../model/db/news";
import HttpError from "../../model/http-error";

// Get all comments for specific news
export const allComments: RequestHandler<{ newsId: string }> = async (
  req,
  res,
  next
) => {
  let comments: IComment[] = [];
  try {
    comments = await CommentModel.find({ news: req.params.newsId })
      .select("-__v")
      .populate("commenter", "name avatar")
      .exec();
  } catch (err) {
    console.log("Error in [allComments-controller]", err);
    return next(new HttpError("Something went wrong!", 500));
  }
  if (comments.length === 0) {
    return next(new HttpError("No Comments Found!", 404));
  }
  res.status(200).json({
    data: comments,
  });
};

export const createComment: RequestHandler = async (req, res, next) => {
  let { text, newsId } = req.body as {
    text: string;
    newsId: string;
  };

  text = text.replace(/\s+/, " ").trim();

  if (validator.isEmpty(text)) {
    return next(new HttpError("Comment text can't be empty!", 422));
  }

  try {
    const user = await UserModel.findById(req.userId);
    const news = await NewsModel.findById(newsId);

    if (user && news) {
      const sess = await startSession();
      sess.startTransaction();
      const resComment = await new CommentModel({
        text: text,
        commenter: user,
        news: news,
      }).save();
      news.comments.push(resComment._id);
      await news.save();
      sess.commitTransaction();

      return res.status(201).json({
        message: "Comment created successfully!",
        comment: resComment._id,
      });
    } else {
      return next(new HttpError("User Or News not Found!", 404));
    }
  } catch (error) {
    console.log("Create comment error & error is", error);
    return next(new HttpError("Comment creation failed!", 400));
  }
};

export const editComment: RequestHandler<{ id: string }> = async (
  req,
  res,
  next
) => {
  let { text } = req.body as {
    text: string;
  };

  text = text.replace(/\s+/, " ").trim();

  if (validator.isEmpty(text)) {
    res.status(201).json({
      message: "Comment updated successfully!",
      updateComment: req.params.id,
    });
  } else {
    CommentModel.findOneAndUpdate(
      { _id: req.params.id, commenter: req.userId! },
      { text: text },
      (err, updatedComment) => {
        if (err) {
          return next(new HttpError("Comment not updated!", 401));
        }
        if (!updatedComment) {
          return next(new HttpError("Comment not exists!", 404));
        }
        res.status(201).json({
          message: "Comment updated successfully!",
          updateComment: updatedComment._id,
        });
      }
    );
  }
};

export const deleteComment: RequestHandler<{ id: string }> = async (
  req,
  res,
  next
) => {
  try {
    const comment = await CommentModel.findOne({
      _id: req.params.id,
      commenter: req.userId!,
    });
    const news = await NewsModel.findById({ _id: comment!.news });
    if (comment && news) {
      const newsCommentIndex = news.comments.indexOf(comment._id);
      news.comments.splice(newsCommentIndex, 1);

      const sess = await startSession();
      sess.startTransaction();
      await comment.remove();
      await news.save();
      sess.commitTransaction();

      return res.status(200).json({
        message: "Comment deleted successfully!",
        deletedComment: comment._id,
      });
    } else {
      return next(new HttpError("Comment Or News not Found!", 404));
    }
  } catch (err) {
    console.log("Delete comment error & error is", err);
    return next(new HttpError("Comment deletion failed!", 400));
  }
};
