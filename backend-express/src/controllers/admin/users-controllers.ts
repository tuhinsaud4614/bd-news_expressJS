import { RequestHandler } from "express";

import { UserModel } from "./../../model/db/user";
import HttpError from "../../model/http-error";

export const getAllUsers: RequestHandler = async (_, res, next) => {
  try {
    const allUsers = await UserModel.find().select("-password -__v").exec();
    if (allUsers.length === 0) {
      return next(new HttpError("No users found!", 404));
    }
    return res.status(200).json({
      users: allUsers.map((user) => user.toObject({ getters: true })),
    });
  } catch (e) {
    console.log("Admin side user fetching error & error is", e);
    return next(new HttpError("Something went wrong!", 500));
  }
};

export const removeUser: RequestHandler<{ userId: string }> = async (
  req,
  res,
  next
) => {
  UserModel.findByIdAndDelete(req.params.userId, (err, user) => {
    if (err) {
      return next(new HttpError("User not deleted!", 400));
    }
    if (!user) {
      return next(new HttpError("Something went wrong!", 400));
    }
    res.status(200).json({
      message: "User deleted successfully!",
      user: user._id,
    });
  });
};
