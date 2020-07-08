import { NewsModel } from "./../model/db/news";
import { UserModel, CommentModel } from "./../model/db/user";
import { RequestHandler } from "express";
import { hash, compare } from "bcryptjs";
import { sign as jwtSign } from "jsonwebtoken";
import HttpError from "../model/http-error";

export const createUser: RequestHandler = async (req, res, next) => {
  try {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };
    const currentUser = await UserModel.findOne({ email: email });
    if (!currentUser) {
      const hashPassword = await hash(password, 12);
      const resUser = await new UserModel({
        name: name,
        email: email,
        password: hashPassword,
        avatar: null,
        address: null,
      }).save();

      res.status(201).json({
        message: "User created successfully!",
        user: resUser.name,
      });
    } else {
      return next(new HttpError("User already exists!", 400));
    }
  } catch (error) {
    console.log("Create user error & error is", error);
    return next(new HttpError("User creation failed!", 401));
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };
    const currentUser = await UserModel.findOne({ email: email });
    if (currentUser) {
      const isMatch = await compare(password, currentUser.password);
      if (!isMatch) {
        return next(new HttpError("Wrong User credentials!", 422));
      } else {
        const token = jwtSign(
          {
            name: currentUser.name,
            email: currentUser.email,
            id: currentUser._id,
          },
          process.env.SECRET_OR_KEY || "supersecret",
          { expiresIn: "1h" }
        );
        res.status(200).json({
          token: token,
          userId: currentUser._id,
        });
      }
    } else {
      return next(new HttpError("User Not Found!", 404));
    }
  } catch (error) {
    console.log("Create user error & error is", error);
    return next(new HttpError("User creation failed!", 401));
  }
};

export const createComment: RequestHandler = async (req, res, next) => {
  try {
    const { text, newsId } = req.body as {
      text: string;
      newsId: string;
    };
    const user = await UserModel.findById(req.userId);
    const news = await NewsModel.findById(newsId);

    if (user && news) {
      const resComment = await new CommentModel({
        text: text,
        commenter: user,
        news: newsId,
      }).save();
      news.comments.push(resComment._id);
      await news.save();
      res.status(201).json({
        message: "Comment created successfully!",
        comment: resComment._id,
      });
    } else {
      return next(new HttpError("User Or News not Found!", 404));
    }
  } catch (error) {
    console.log("Create comment error & error is", error);
    return next(new HttpError("Comment creation failed!", 401));
  }
};

export const editComment: RequestHandler<{ id: string }> = async (
  req,
  res,
  next
) => {
  const { text } = req.body as {
    text: string;
  };
  CommentModel.findOneAndUpdate(
    { _id: req.params.id, commenter: req.userId },
    { text: text },
    (err, updatedComment) => {
      if (err) {
        return next(new HttpError("Comment not updated!", 401));
      }
      if (!updatedComment) {
        return next(new HttpError("Comment not exists!", 404));
      }
      res.json({
        message: "Comment updated successfully!",
        updateComment: updatedComment._id,
      });
    }
  );
};

export const deleteComment: RequestHandler<{ id: string }> = async (
  req,
  res,
  next
) => {
  CommentModel.findOneAndDelete(
    { _id: req.params.id, commenter: req.userId },
    (err, deletedComment) => {
      if (err) {
        return next(new HttpError("Comment not deleted!", 400));
      }
      if (!deletedComment) {
        return next(new HttpError("Comment not exists!", 400));
      }
      res.json({
        message: "Comment deleted successfully!",
        updateComment: deletedComment._id,
      });
    }
  );
};
