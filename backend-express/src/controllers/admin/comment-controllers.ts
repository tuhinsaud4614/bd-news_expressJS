import { RequestHandler } from "express";

import { CommentModel } from "./../../model/db/user";
import HttpError from "../../model/http-error";

export const getAllComments: RequestHandler = async (_, res, next) => {
  try {
    const allComments = await CommentModel.find().select("-__v").exec();
    if (allComments.length === 0) {
      return next(new HttpError("No comments found!", 404));
    }
    return res.status(200).json({
      comments: allComments.map((comment) =>
        comment.toObject({ getters: true })
      ),
    });
  } catch (e) {
    console.log("Admin side comments fetching error & error is", e);
    return next(new HttpError("Something went wrong!", 500));
  }
};

export const removeComment: RequestHandler<{ commentId: string }> = (
  req,
  res,
  next
) => {
  CommentModel.findByIdAndDelete(req.params.commentId, (err, comment) => {
    if (err) {
      return next(new HttpError("Comment not deleted!", 400));
    }
    if (!comment) {
      return next(new HttpError("Something went wrong!", 400));
    }

    res.status(200).json({
      message: "Comment deleted successfully!",
      comment: comment._id,
    });
  });
};
